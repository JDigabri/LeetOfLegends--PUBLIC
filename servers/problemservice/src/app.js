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

const port = process.env.PORT || 8084;

// Connect to Neo4j Aura database
const driver = neo4j.driver(
  process.env.NEO_4J_CONNECTION_URL,
  neo4j.auth.basic(process.env.NEO_4J_USER, process.env.NEO_4J_PASSWORD)
);
const session = driver.session();

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
    req.user = decoded;
    next();
  });
}

// Create a new problem
app.post("/createProblem", async (req, res) => {
  const { title, description, testCases, encodedHarness } = req.body;

  if (!title || !description || !testCases || !encodedHarness) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const tx = session.beginTransaction();

    // Create the problem node with encodedHarness
    const result = await tx.run(
      "CREATE (p:Problem {title: $title, description: $description, encodedHarness: $encodedHarness}) RETURN p",
      { title, description, encodedHarness }
    );
    const singleRecord = result.records[0];
    const problemNode = singleRecord.get(0);

    // Create test case nodes and link them to the problem node
    for (const testCase of testCases) {
      await tx.run(
        "MATCH (p:Problem {title: $title}) CREATE (t:TestCase {input: $input, output: $output})-[:BELONGS_TO]->(p)",
        { title, input: testCase.input, output: testCase.output }
      );
    }

    await tx.commit();
    res.status(201).json({ problem: problemNode.properties });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating problem" });
  }
});



// Get a random problem along with its test cases
app.get("/randomProblem", async (req, res) => {
  try {
    // Get the total number of Problem nodes
    const countResult = await session.run("MATCH (p:Problem) RETURN count(p) as total");
    const totalCount = countResult.records[0].get("total").toNumber();

    // If there are no problems, return a 404
    if (totalCount === 0) {
      return res.status(404).json({ message: "No problems found" });
    }

    // Fetch a random problem and its test cases
    const result = await session.run(
      "MATCH (p:Problem)-[:BELONGS_TO]-(t:TestCase) RETURN p, collect(t) AS testCases LIMIT 1",
    );
    
    const singleRecord = result.records[0];
    const problemNode = singleRecord.get("p");
    const testCasesArray = singleRecord.get("testCases");

    const testCases = testCasesArray.map(tc => tc.properties);

    res.status(200).json({
      problem: problemNode.properties,
      testCases
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching problem" });
  }
});

// Get a specific problem by title along with its test cases
app.get("/problem/:title", async (req, res) => {
  const { title } = req.params;

  try {
    // Fetch the problem node with the given title and its test cases
    const result = await session.run(
      "MATCH (p:Problem {title: $title})-[:BELONGS_TO]-(t:TestCase) " +
      "RETURN p, collect(t) AS testCases",
      { title }
    );

    if (result.records.length === 0) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const singleRecord = result.records[0];
    const problemNode = singleRecord.get("p");
    const testCasesArray = singleRecord.get("testCases");

    const testCases = testCasesArray.map(tc => tc.properties);

    res.status(200).json({
      problem: problemNode.properties,
      testCases
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching problem by title" });
  }
});



app.listen(port, '0.0.0.0', () => {
  console.log("Server is running on http://0.0.0.0:8084/");
});
