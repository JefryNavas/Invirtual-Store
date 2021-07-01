const { Pool } = require('pg');

const config = {
    // Conexión para la base de datos de Heroku
    /*     connectionString: 'postgres://kxxlgecbpcpshw:db6f64562de83034c96e962ae82267f74feed602afe73eebcc8895b27badbd94@ec2-54-145-224-156.compute-1.amazonaws.com:5432/dcak7rmvtrl7cp',
        ssl: { rejectUnauthorized: false }
     */

    // Conexión para la base de datos local
    user: 'postgres',
    host: 'localhost',
    password: 'sololdu',
    database: 'InvirtualStore'
};
const pool = new Pool(config)

module.exports = { pool }