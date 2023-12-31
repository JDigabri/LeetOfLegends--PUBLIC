// app.js
const express = require("express");
const neo4j = require("neo4j-driver");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require('cookie-parser');


const app = express();

require('dotenv').config();

app.use(express.json());
app.use(
  cors({
    origin: "http://34.139.42.66:5173",
    credentials: true,
  })
);
app.use(cookieParser());

const port = process.env.PORT || 8081;
// Connect to Neo4j Aura database
const driver = neo4j.driver(
  process.env.NEO_4J_CONNECTION_URL,
  neo4j.auth.basic(process.env.NEO_4J_USER, process.env.NEO_4J_PASSWORD)
);
const session = driver.session();

// Register route
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Check if user with the same username already exists
  try {
    const userCheck = await session.run(
      "MATCH (a:User {username: $username}) RETURN a",
      { username }
    );

    if (userCheck.records.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while checking for existing user!",
    });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user in the database
  try {
    const result = await session.run(
      "CREATE (a:User {username: $username, password: $password}) RETURN a",
      { username, password: hashedPassword }
    );

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const userQuery = await session.run(
      "MATCH (a:User {username: $username}) RETURN a",
      { username }
    );

    const user = userQuery.records[0]?.get(0).properties;

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password!" });
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid username or password!" });
    }

    // Generate JWT
    const token = jwt.sign({ username: user.username }, "SECRET_KEY", {
      expiresIn: "6h",
    });

    res.cookie("jwt", token, {
      secure: false,
      maxAge: 3600000,
      httpOnly: true,
      sameSite: "Lax",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
});

function authenticateJWT(req, res, next) {
  // Extract JWT token from cookies
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token is not valid" });
    }
    // Attach the decoded payload to the request object
    req.user = decoded;
    next();
  });
}

app.get("/getUserInfo", authenticateJWT, async (req, res) => {
  // The username is obtained from the decoded JWT
  const { username } = req.user;

  try {
    const result = await session.run(
      "MATCH (a:User {username: $username}) RETURN a",
      { username }
    );

    const user = result.records[0]?.get(0).properties;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});


app.listen(port, '0.0.0.0', () => {
  console.log("Server is running on http://localhost:8081/");
});
