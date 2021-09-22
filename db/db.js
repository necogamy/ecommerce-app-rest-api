const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'ecommerce_database',
    host: process.env.DB_HOST,
    port: 5432
});

module.exports = pool;