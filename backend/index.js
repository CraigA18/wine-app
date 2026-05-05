require('dotenv').config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Create the pool (no password needed for local trust auth)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  password: process.env.DB_PASSWORD || undefined, // Handle empty password
});

// Test database connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('✅ Successfully connected to PostgreSQL');
    release();
  }
});

// Get all wines
app.get("/wines", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM wines");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Add a new wine
app.post("/wines", async (req, res) => {
  const { name, varietal, rating } = req.body;
  
  // Basic validation
  if (!name || !varietal) {
    return res.status(400).json({ error: "Name and varietal are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO wines (name, varietal, rating) VALUES ($1, $2, $3) RETURNING *",
      [name, varietal, rating || null] // rating is optional
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Optional: Delete a wine
app.delete("/wines/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query("DELETE FROM wines WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Wine not found" });
    }
    res.json({ message: "Wine deleted", wine: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});