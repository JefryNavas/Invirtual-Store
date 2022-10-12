const { Pool } = require('pg');

const config = {
    // Conexión para la base de datos de Heroku
    // connectionString: 'postgres://ndpxotvtytvyrb:ccdfce22c8d41c2ea1400795e60696ed4be5f6375d76f047a0724efd799b53aa@ec2-3-225-213-67.compute-1.amazonaws.com:5432/dea2cdulqk98il',
    // ssl: { rejectUnauthorized: false }


    // Conexión para la base de datos local
    user: 'postgres',
    host: 'localhost',
    password: 'sololdu',
    database: 'InVirtual'
};
const pool = new Pool(config)

module.exports = { pool }