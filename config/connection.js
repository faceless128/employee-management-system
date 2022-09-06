const mysql = require('mysql2');
var dotenv = require('dotenv');

// enviromnemt variables for database
dotenv.config();
var mysqlPass = process.env.DB_PASS;

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  },
);

module.exports = db;