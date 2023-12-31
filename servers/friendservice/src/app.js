// app.js
const express = require("express");
const neo4j = require("neo4j-driver");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://34.139.42.66:5173",
    credentials: true,
  })
);
app.use(cookieParser());

const port = process.env.PORT || 8082;
const driver = neo4j.driver(
  process.env.NEO_4J_CONNECTION_URL,
  neo4j.auth.basic(process.env.NEO_4J_USER, process.env.NEO_4J_PASSWORD)
);
const session = driver.session();

function authenticateJWT(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token is not valid" });
    }
    req.user = decoded;
    next();
  });
}

app.post("/addFriend", authenticateJWT, async (req, res) => {
  // The username is obtained from the decoded JWT
  const { username } = req.user;

  // The friend's username is expected to be in the request body
  const { friendUsername } = req.body;

  try {
    // Check if the friend exists in the database
    const friendCheck = await session.run(
      "MATCH (a:User {username: $friendUsername}) RETURN a",
      { friendUsername }
    );

    if (friendCheck.records.length === 0) {
      return res.status(400).json({ message: "Friend does not exist" });
    }

    // Check if they are already friends
    const areFriends = await session.run(
      "MATCH (a:User {username: $username})-[r:FRIEND]->(b:User {username: $friendUsername}) RETURN r",
      { username, friendUsername }
    );

    if (areFriends.records.length > 0) {
      return res.status(400).json({ message: "Already friends" });
    }

    // Create the friendship relation in the database
    const result = await session.run(
      "MATCH (a:User {username: $username}), (b:User {username: $friendUsername}) CREATE (a)-[:FRIEND]->(b)",
      { username, friendUsername }
    );

    res.status(200).json({ message: "Friend added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/getFriends", authenticateJWT, async (req, res) => {
  const { username } = req.user;

  try {
    // Query to fetch all friends who share a bidirectional FRIEND relationship
    const result = await session.run(
      "MATCH (a:User {username: $username})-[r1:FRIEND]-(b:User)-[r2:FRIEND]-(a:User) RETURN b.username AS friend",
      { username }
    );

    // Extract usernames from the query result
    const friends = result.records.map((record) => record.get("friend"));

    res.status(200).json({ friends });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log("Server is running on http://localhost:8082/");
});
