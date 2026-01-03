require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { Pool } = require("pg");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");



const app = express();

/* ===============================
   MIDDLEWARE
================================ */
app.use(cors());
app.use(express.json());

/* ===============================
   FRONTEND
================================ */
app.use(express.static(path.join(__dirname, "../frontend")));

/* ===============================
   DATABASE (SUPABASE POOLER)
================================ */
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: false
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
   HOME
================================ */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

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

    // ✅ FULL DETAILS EMAIL
    await transporter.sendMail({
      from: `"Bais Express Logistics" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: "🚛 New Call Request - Bais Express Logistics",
      html: `
        <h2>📞 New Call Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Pickup:</strong> ${pickup || "N/A"}</p>
        <p><strong>Drop:</strong> ${drop || "N/A"}</p>
        <p><strong>Cargo:</strong> ${message || "N/A"}</p>
        <hr>
        <small>Bais Express Logistics Website</small>
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
      return res.json({ success: false, msg: "Invalid credentials" });
    }

    const admin = result.rows[0];
    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.json({ success: false, msg: "Invalid credentials" });
    }

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.json({ success: false, msg: "Server error" });
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
   ADMIN – MARK COMPLETE
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
   ADMIN – FORGOT PASSWORD
================================ */
app.post("/api/admin/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query(
      "SELECT id FROM admins WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.json({ msg: "Admin not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      `UPDATE admins
       SET reset_token=$1, reset_token_expiry=$2
       WHERE email=$3`,
      [token, expiry, email]
    );

    const resetLink =
      `http://localhost:5500/frontend/reset-password.html?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Bais Express Logistics" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Admin Password",
      html: `
        <p>Click below to reset password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Valid for 15 minutes</p>
      `
    });

    res.json({ msg: "Reset link sent" });

  } catch (err) {
    console.error(err);
    res.json({ msg: "Server error" });
  }
});

/* ===============================
   ADMIN – RESET PASSWORD
================================ */
app.post("/api/admin/reset-password", async (req, res) => {
  const { token, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT id FROM admins
       WHERE reset_token=$1
       AND reset_token_expiry > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.json({ msg: "Invalid or expired token" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE admins
       SET password=$1,
           reset_token=NULL,
           reset_token_expiry=NULL
       WHERE id=$2`,
      [hashed, result.rows[0].id]
    );

    res.json({ msg: "Password reset successful" });

  } catch (err) {
    console.error(err);
    res.json({ msg: "Server error" });
  }
});

/* ===============================
   SERVER START
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
