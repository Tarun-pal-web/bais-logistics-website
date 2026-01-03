require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const app = express();

/* ===============================
   MIDDLEWARE
================================ */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

/* ===============================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.json({
    status: "Backend is running",
    service: "Bais Express Logistics API"
  });
});

/* ===============================
   DATABASE (SUPABASE)
================================ */
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

/* ===============================
   DB TEST
================================ */
(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ DB error:", err.message);
  }
})();

/* ===============================
   CREATE ENQUIRY
================================ */
app.post("/api/enquiry", async (req, res) => {
  const { name, phone, pickup, drop, message } = req.body;

  if (!name || !phone) {
    return res.json({ success: false });
  }

  try {
    await pool.query(
      `INSERT INTO enquiries
      (name, phone, pickup, drop_location, message, status)
      VALUES ($1,$2,$3,$4,$5,'Pending')`,
      [name, phone, pickup || null, drop || null, message || null]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* ===============================
   ADMIN LOGIN
================================ */
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM admins WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.json({ success: false });
    }

    const admin = result.rows[0];
    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.json({ success: false });
    }

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

/* ===============================
   ADMIN – GET ENQUIRIES
================================ */
app.get("/api/admin/enquiries", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM enquiries ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch {
    res.status(500).json([]);
  }
});

/* ===============================
   ADMIN – UPDATE STATUS
================================ */
app.put("/api/admin/enquiries/:id", async (req, res) => {
  try {
    await pool.query(
      "UPDATE enquiries SET status='Completed' WHERE id=$1",
      [req.params.id]
    );
    res.json({ success: true });
  } catch {
    res.json({ success: false });
  }
});

/* ===============================
   ADMIN – DELETE
================================ */
app.delete("/api/admin/enquiries/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM enquiries WHERE id=$1",
      [req.params.id]
    );
    res.json({ success: true });
  } catch {
    res.json({ success: false });
  }
});

/* ===============================
   SERVER START
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
