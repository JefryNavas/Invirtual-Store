const { Pool } = require('pg');

const config = {
    user: 'postgres',
    host: 'localhost',
    password: 'sololdu',
    database: 'InVirtual'
};
const pool = new Pool(config)

module.exports = { pool }