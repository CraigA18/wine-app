const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "alexcraig",
  host: "localhost",
  database: "wine_app",
  port: 5432,
});

app.get("/wines", async (req, res) => {

  try {
  const result = await pool.query("SELECT * FROM wines");
  res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/wines", async (req, res) => {
  const { name, type, rating } = req.body;

  try {
  const result = await pool.query(
    "INSERT INTO wines (name, type, rating) VALUES ($1, $2, $3) RETURNING *",
    [name, type, rating]
  );
  res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.listen(3001, () => {
  console.log("Backend running on port 3001");
});