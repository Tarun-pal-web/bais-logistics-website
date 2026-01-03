require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const app = express();

/* ===============================
   MIDDLEWARE
================================ */
app.use(cors({
  origin: [
    "https://tarun-pal-web.github.io",
    "https://adorable-cuchufli-b8c50b.netlify.app",
    "http://localhost:5500",
    "http://127.0.0.1:5500"
  ],
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
   EMAIL SETUP
================================ */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* ===============================
   CREATE ENQUIRY + EMAIL
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

    await transporter.sendMail({
      from: `"Bais Express Logistics" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "🚛 New Transport Enquiry",
      html: `
        <h3>New Enquiry Received</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Pickup:</b> ${pickup || "-"}</p>
        <p><b>Drop:</b> ${drop || "-"}</p>
        <p><b>Message:</b> ${message || "-"}</p>
      `
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Enquiry error:", err);
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
  } catch {
    res.json({ success: false });
  }
});

/* ===============================
   FORGOT PASSWORD (SEND MAIL)
================================ */
app.post("/api/admin/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query(
      "SELECT id FROM admins WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.json({ success: true }); // security
    }

    const token = crypto.randomBytes(32).toString("hex");

    await pool.query(
      "UPDATE admins SET reset_token=$1, reset_expiry=NOW()+INTERVAL '15 minutes' WHERE email=$2",
      [token, email]
    );

    const resetLink = `https://tarun-pal-web.github.io/bais-logistics-website/reset-password.html?token=${token}`;

    await transporter.sendMail({
      from: `"Bais Express Logistics" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Reset Admin Password",
      html: `
        <h3>Password Reset</h3>
        <p>Click below link to reset password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p><b>Valid for 15 minutes</b></p>
      `
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ success: false });
  }
});

/* ===============================
   RESET PASSWORD
================================ */
app.post("/api/admin/reset-password", async (req, res) => {
  const { token, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT id FROM admins WHERE reset_token=$1 AND reset_expiry > NOW()",
      [token]
    );

    if (result.rows.length === 0) {
      return res.json({ msg: "Invalid or expired token" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "UPDATE admins SET password=$1, reset_token=NULL, reset_expiry=NULL WHERE id=$2",
      [hashed, result.rows[0].id]
    );

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ===============================
   ADMIN – ENQUIRIES
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
   TEST MAIL
================================ */
app.get("/api/test-mail", async (req, res) => {
  try {
    await transporter.sendMail({
      from: `"Bais Express Logistics" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Test Mail – Bais Express",
      text: "✅ Email setup working fine"
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Mail error:", err);
    res.status(500).json({ success: false });
  }
});

/* ===============================
   SERVER START
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});