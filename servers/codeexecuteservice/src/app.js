const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const neo4j = require("neo4j-driver");

const app = express();
app.use(bodyParser.json());

const { exec } = require('child_process');
require('dotenv').config();

app.use(
  cors({
    origin: "http://34.139.42.66:5173",
    credentials: true,
  })
);

const port = process.env.PORT || 8083;


const driver = neo4j.driver(
  process.env.NEO_4J_CONNECTION_URL,
  neo4j.auth.basic(process.env.NEO_4J_USER, process.env.NEO_4J_PASSWORD)
);
const session = driver.session();

function executeCode(code, language, callback) {
  if (code.length > 10000) {
    return callback(new Error("Code length exceeds the limit"), null, null);
  }

  const allowedLanguages = ["python"];
  if (!language || !allowedLanguages.includes(language)) {
    return callback(new Error("Language not allowed"), null, null);
  }
  


  //make sure to get rid of all imports
  const sanitizedCode = code.replace(/(os\.system|exec|eval|subprocess\.run)/g, '');

  const base64Code = Buffer.from(sanitizedCode).toString('base64');

  const dockerCommand = [
    "docker",
    "run",
    "--rm",
    "-i",
    "--memory=100m",
    '--cpus="0.5"',
    '--network="none"',
    "--user=1000:1000",
    "--read-only",
    "--name=code_execution_container",
    "python:3.8",
    "timeout",
    "20",
    "python",
    "-c",
    `'exec(__import__("base64").b64decode("${base64Code}").decode("utf-8"))'`,
  ];
  
  
  exec(dockerCommand.join(" "), { timeout: 20000 }, (error, stdout, stderr) => {
    callback(error, stdout, stderr);
  });
}  


async function fetchEncodedHarness(problemId) {
  const session = driver.session();
  try {
    const result = await session.run(
      "MATCH (p:Problem {title: $title}) RETURN p.encodedHarness AS harness",
      { title: problemId }
    );


    if (result.records.length === 0) {
      return null; // Problem not found
    }


    return result.records[0].get('harness');
  } finally {
    await session.close();
  }
}


app.post('/execute', async (req, res) => {
  const { code, language, problemId } = req.body;

  if (!problemId) {
    return res.status(400).json({ message: "Problem ID is required" });
  }

  try {
    // Fetch the encoded harness from the database
    const harness = await fetchEncodedHarness(problemId);
    if (!harness) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Combine user code with the harness
    const combinedCode = code + "\n" + Buffer.from(harness, 'base64').toString('utf-8');

    // Execute the combined code
    executeCode(combinedCode, language, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).send({ error: stderr });
      }
      res.send({ result: stdout });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error executing code" });
  }
});



app.listen(port, '0.0.0.0', () => {
  console.log('Server is running on http://localhost:8083');
});
