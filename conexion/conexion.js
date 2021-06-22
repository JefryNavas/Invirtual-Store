const { Pool } = require('pg');

const config = {
    user: 'postgres',
    host: 'localhost',
    password: '123',
    database: 'Invirtual_Store'
};
const pool = new Pool(config)

module.exports = { pool }