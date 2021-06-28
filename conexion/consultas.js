const { pool } = require("./conexion")

const getUsers = async() => {
    try {
        const res = await pool.query('select id_empleado,nombre_tipo,nombre,email from empleado,tipo_empleado where empleado.id_tipo = tipo_empleado.id_tipo');
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
            return "Usuario Eliminado";
        } else
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

const getProvedores = async() => {
    try {
        const res = await pool.query('select * from proveedor');
        pool.end();
        return res.rows;

    } catch (error) {
        return error.message;
    }
}

const insertProv = async(nombre) => {
    try {
        const consulta = `insert into proveedor (nombre_prov) values ('${nombre}')`
        const res = await pool.query(consulta);
        if (res.rowCount == 1) {
            return "Proveedor registrado";
        } else
            return "No se pudo registrar";

    } catch (error) {
        return error.message;
    }
}


module.exports = { getUsers, insertUser, deleteUser, editUser, authUser, authEmail, getProvedores, insertProv }