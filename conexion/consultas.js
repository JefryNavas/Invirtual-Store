const { pool } = require("./conexion")

const getUsers = async() => {
    try {
        const res = await pool.query('select * from empleado');
        pool.end();
        return res.rows;

    } catch (error) {
        return error.message;
    }
}
const insertUser = async(tipo, nombre, email, password) => {
    try {
        const consulta = `insert into empleado(id_tipo,nombre,email,password) values ('${tipo}','${nombre}','${email}','${password}')`
        const res = await pool.query(consulta);
        if (res.rowCount == 1) {
            return "Usuario registrado";
        } else
            return "No existe el Usuario";

    } catch (error) {
        return error.message;
    }
}
const deleteUser = async(id) => {
    try {
        const consulta = `delete from empleado where id_empleado = ${id}`
        const res = await pool.query(consulta);
        if (res.rowCount == 1) {
            pool.end();
            return "Usuario Eliminado";
        } else pool.end();
        return "No existe el Usuario";


    } catch (error) {
        return error.message;
    }
}

const editUser = async(id, nombre, email, password) => {
    try {
        const consulta = `update empleado set nombre = '${nombre}',email = '${email}', password = '${password}' where id_empleado = ${id}`
        const res = await pool.query(consulta);
        if (res.rowCount == 1) {
            pool.end();
            return "Usuario Modificado Correctamente";
        } else pool.end();
        return "No existe el Usuario";
    } catch (error) {
        return error.message;
    }
}

module.exports = { getUsers, insertUser, deleteUser, editUser }