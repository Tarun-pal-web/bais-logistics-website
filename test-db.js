require("dotenv").config();
const { Pool } = require("pg");

console.log("DATABASE_URL =", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query("select now()")
  .then(res => {
    console.log("✅ DB CONNECTED:", res.rows[0]);
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ DB ERROR:", err.message);
    process.exit(1);
  });
