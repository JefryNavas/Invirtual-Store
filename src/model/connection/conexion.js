const { Pool } = require("pg");

const config = {
    // Conexión local
    // user: "postgres",
    // host: "localhost",
    // password: "sololdu",
    // database: "InVirtual",
    //---- Azure DB
    user: 'invirtualadmin@invirtualdb',
    host: 'invirtualdb.postgres.database.azure.com',
    password: '2303Titulacion',
    database: 'invirtual',
    port: '5432',
    ssl: true
};
const pool = new Pool(config);

module.exports = { pool };