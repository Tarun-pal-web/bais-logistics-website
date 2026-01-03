require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { Pool } = require("pg");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const app = express();

/* ===============================
   MIDDLEWARE (VERY IMPORTANT)
   🔥 MUST BE ON TOP
================================ */
app.use(cors({
  origin: [
    "https://adorable-cuchufi-b8c50b.netlify.app",
    "http://localhost:5500",
    "http://127.0.0.1:5500"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// extra safety for browser preflight
app.options("*", cors());

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
   DATABASE (SUPABASE / POSTGRES)
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
   CUSTOMER – CREATE ENQUIRY
================================ */
app.post("/api/enquiry", async (req, res) => {
  const { name, phone, pickup, drop, message } = req.body;

  if (!name || !phone) {
    return res.json({ success: false, msg: "Name & phone required" });
  }

  try {
    await pool.query(
      `INSERT INTO enquiries
       (name, phone, pickup, drop_location, message, status)
       VALUES ($1,$2,$3,$4,$5,'Pending')`,
      [name, phone, pickup || null, drop || null, message || null]
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Bais Express Logistics" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: "🚛 New Call Request",
      html: `
        <h2>📞 New Call Request</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Pickup:</b> ${pickup || "N/A"}</p>
        <p><b>Drop:</b> ${drop || "N/A"}</p>
        <p><b>Cargo:</b> ${message || "N/A"}</p>
      `
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

/* ===============================
   ADMIN – LOGIN
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
    console.error(err);
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
   ADMIN – DELETE ENQUIRY
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