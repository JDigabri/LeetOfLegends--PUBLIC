const express = require('express');
const uuid = require('uuid');
const neo4j = require('neo4j-driver');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const WebSocket = require('ws');
const http = require('http');
const cookieParser = require("cookie-parser");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
require('dotenv').config();

app.use(express.json());
app.use(
  cors({
    origin: "http://34.139.42.66:5173",
    credentials: true,
  })
);
app.use(cookieParser());

const port = process.env.PORT || 8085;

// Connect to Neo4j Aura database
const driver = neo4j.driver(
  process.env.NEO_4J_CONNECTION_URL,
  neo4j.auth.basic(process.env.NEO_4J_USER, process.env.NEO_4J_PASSWORD)
);
const session = driver.session();


function authenticateJWT(token) {
    return new Promise((resolve, reject) => {
        if (!token) {
            reject(new Error("No token provided"));
        } else {
            jwt.verify(token, process.env.KEY, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        }
    });
}


const clients = new Set();


const gameSessions = new Map();

wss.on('connection', (ws, req) => {
    console.log('WebSocket client connected');


  // Extract JWT token from query or headers
  const token = req.url.split('token=')[1] || req.headers['sec-websocket-protocol'];

  authenticateJWT(token).then(decoded => {
    ws.user = decoded;


    clients.add(ws);
    ws.on('close', () => {
        clients.delete(ws);
    });


    ws.on('message', (message) => {
      console.log('Received message:', message);
      const { type, sessionId } = JSON.parse(message);

      if (type === 'joinSession') {
          joinSession(ws, sessionId);
      }else if (type === 'endGame') {
          endGame(ws, sessionId);
      }
    });
    ws.send('Connected to WebSocket server');

    ws.on('close', () => {
      leaveAllSessions(ws);
  });
  }).catch(err => {
    ws.close(1008, 'Unauthorized'); // Close connection if authentication fails
  });
});

function joinSession(ws, sessionId) {
  if (!gameSessions.has(sessionId)) {
      gameSessions.set(sessionId, new Set());
  }
  const clients = gameSessions.get(sessionId);
  clients.add(ws);
  ws.currentSession = sessionId; // Keep track of the session the client is in

  // Check if two players have joined the session
  if (clients.size === 2) {
      // Notify all clients in the session to start the game
      broadcastToSession(sessionId, JSON.stringify({ type: 'startGame' }));
  }
}


function leaveAllSessions(ws) {
  if (ws.currentSession && gameSessions.has(ws.currentSession)) {
      const clients = gameSessions.get(ws.currentSession);
      clients.delete(ws);
      if (clients.size === 0) {
          gameSessions.delete(ws.currentSession);
      }
  }
}

function broadcastToSession(sessionId, message) {
  if (gameSessions.has(sessionId)) {
      for (let client of gameSessions.get(sessionId)) {
          if (client.readyState === WebSocket.OPEN) {
              client.send(message);
          }
      }
  }
}
function endGame(ws, sessionId) {
  if (gameSessions.has(sessionId)) {
      broadcastToSession(sessionId, JSON.stringify({ type: 'endGame' }));
      // Optionally, you can also delete the session after the game ends
      gameSessions.delete(sessionId);
  }
}
function broadcastMessage(sender, message) {
  for (let client of clients) {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
          client.send(message);
      }
  }
}
// Create a new game session
app.post('/createGameSession', async (req, res) => {
  const sessionId = uuid.v4();
  const { problemId, results } = req.body; // Assume these are passed in the request body

  // Validate the inputs as necessary
  if (!problemId) {
    return res.status(400).json({ message: "Problem ID is required" });
  }

  try {
    await session.run(
      'CREATE (g:GameSession { sessionId: $sessionId, createdAt: $createdAt, problemId: $problemId, results: $results }) RETURN g',
      {
        sessionId: sessionId,
        createdAt: new Date().toISOString(),
        problemId: problemId,
        results: results || [] // Default to an empty array if no results are provided
      }
    );

    res.status(201).json({ message: 'Game session created successfully', sessionId: sessionId });
  } catch (error) {
    console.error('Error creating game session:', error);
    res.status(500).json({ message: 'Error creating game session' });
  }
});


// Player joins a game sessio
app.post('/joinGameSession', async (req, res) => {
  const { gameId, username } = req.body; 

  if (!gameId || !username) {
      return res.status(400).json({ message: "Both gameId and username are required" });
  }

  try {
      const result = await session.run(
          'MATCH (u:User { username: $username }), (g:GameSession { sessionId: $gameId }) ' +
          'MERGE (u)-[:PARTICIPATES_IN]->(g) ' +
          'RETURN g, u',
          { gameId: gameId, username: username }
      );

      if (result.records.length === 0) {
          return res.status(404).json({ message: 'Game session or user not found' });
      }

      res.status(200).json({ message: 'User joined game session successfully', session: result.records[0].get(0), user: result.records[0].get(1) });
  } catch (error) {
      console.error('Error joining game session:', error);
      res.status(500).json({ message: 'Error joining game session' });
  }
});

app.get('/getGameSession/:sessionId', async (req, res) => {
    const { sessionId } = req.params;

    if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
    }

    try {
        const result = await session.run(
            'MATCH (g:GameSession { sessionId: $sessionId }) ' +
            'RETURN g',
            { sessionId }
        );

        if (result.records.length === 0) {
            return res.status(404).json({ message: 'Game session not found' });
        }

        const gameSession = result.records[0].get('g').properties;

        res.status(200).json({ gameSession });
    } catch (error) {
        console.error('Error retrieving game session:', error);
        res.status(500).json({ message: 'Error retrieving game session' });
    }
});

app.put('/updateGameSession/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  const { results } = req.body; // results is an object now
  const currentTime = new Date().toISOString();

  try {
    // No need to map results as it's not an array
    const formattedResults = JSON.stringify(results);

    const result = await session.run(
      'MATCH (g:GameSession { sessionId: $sessionId }) ' +
      'SET g.results = $formattedResults, g.updatedAt = $currentTime ' +
      'RETURN g',
      { sessionId, formattedResults, currentTime }
    );

    if (!result.records.length) {
      return res.status(404).json({ message: 'Game session not found' });
    }

    const updatedGameSession = result.records[0].get(0).properties;
    res.json({ message: 'Game session updated successfully', gameSession: updatedGameSession });
  } catch (error) {
    console.error('Error updating game session:', error);
    res.status(500).json({ message: 'Error updating game session', error: error.toString() });
  }
});



app.listen(port, '0.0.0.0', () => {
  console.log('app is running on http://localhost:8085/');
});


server.listen(8086,'0.0.0.0', () => {
  console.log('Server is running on http://localhost:8086/');
});