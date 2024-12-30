const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  host:process.env.DB_HOST,
  user:process.env.DB_USER,
  port:process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database:process.env.DB_NAME,
};

async function connectToDB() {
  return await mysql.createConnection(dbConfig);
}

module.exports = connectToDB;
