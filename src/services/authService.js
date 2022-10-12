const { pool } = require("../../src/connection/conexion")
const authUser = async(email, pass) => {
    try {
        const res = await pool.query(`select * from empleado where email='${email}' and password = '${pass}'`);
        if (res.rows == 0) {
            return false;
        }
        return res.rows;

    } catch (error) {
        return error.message;
    }
}
const authCli = async(email, pass) => {
    try {
        const res = await pool.query(`select * from cliente where email='${email}' and password = '${pass}'`);
        if (res.rows == 0) {
            return false;
        }
        return res.rows;

    } catch (error) {
        return error.message;
    }
}
const authEmail = async(email) => {
    try {
        const res = await pool.query(`select * from empleado where email='${email}'`);
        if (res.rows.length > 0) {
            return false;
        }
        return true;

    } catch (error) {
        return error.message;
    }
}
const authEmailCli = async(email) => {
    try {
        const res = await pool.query(`select * from cliente where email='${email}'`);

        if (!res.rows) {
            return false;
        }
        return res.rows;

    } catch (error) {
        return error.message;
    }
}
module.exports = {
    authUser,
    authCli,
    authEmail,
    authEmailCli
}