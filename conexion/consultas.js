const { pool } = require("./conexion")

const getUsers = async() => {
    try {
        const res = await pool.query('select id_empleado,empleado.id_tipo,nombre_tipo,nombre,email,password from empleado,tipo_empleado where empleado.id_tipo = tipo_empleado.id_tipo');
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

const editUser = async(id, nombre, rol, email, password) => {
    try {
        const consulta = `update empleado set nombre = '${nombre}',email = '${email}', password = '${password}',id_tipo = '${rol}' where id_empleado = ${id}`
        const res = await pool.query(consulta);
        if (res.rowCount == 1) {
            return "Usuario Modificado Correctamente";
        } else
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
const deleteProv = async(id) => {
    try {
        const consulta = `delete from proveedor where cod_prov = ${id}`
        const res = await pool.query(consulta);
        if (res.rowCount == 1) {
            return "Proveedor Eliminado";
        } else
            return "No existe el Proveedor";


    } catch (error) {
        return error.message;
    }
}

const getGeneros = async() => {
    try {
        const res = await pool.query('select * from genero');
        return res.rows;

    } catch (error) {
        return error.message;
    }
}

const insertCliente = async(cedula, nombre, email, edad, gen, tel, medio) => {
    try {
        const consulta = `insert into cliente values ('${cedula}','${nombre}','${email}','${edad}','${gen}','${tel}','${medio}')`
        const res = await pool.query(consulta);
        if (res.rowCount == 1) {
            return "Cliente registrado";
        } else
            return "No se pudo registrar el cliente";

    } catch (error) {
        return error.message;
    }
}


const getClientes = async() => {
    try {
        const res = await pool.query('select cl.cedula_cli, cl.nombre_cli, cl.email, cl.edad, gen.genero,cl.tlf from cliente as cl, genero as gen where cl.id_gen = gen.id_gen');
        return res.rows;

    } catch (error) {
        return error.message;
    }
}


const buscarPorCed = async(cedula) => {
    try {
        const res = await pool.query(`select * from cliente where cedula_cli = '${cedula}'`);
        return res.rows;

    } catch (error) {
        return error.message;
    }
}


module.exports = {
    getUsers,
    insertUser,
    deleteUser,
    editUser,
    authUser,
    authEmail,
    getProvedores,
    insertProv,
    deleteProv,
    getGeneros,
    insertCliente,
    getClientes,
    buscarPorCed
}