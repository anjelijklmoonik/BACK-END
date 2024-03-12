const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '09anjeli',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'backend',
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};