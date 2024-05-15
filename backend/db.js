const { Pool } = require('pg');

const pool = new Pool({
  user: 'nmferrin', // Your PostgreSQL username
  host: 'localhost',
  database: 'chatbot', // Your database name
  password: 'nmferrin', // Your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;
