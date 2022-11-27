const { pool } = require("../../model/connection/conexion")

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

const updateCli = async(user, pass) => {
    try {
        const consulta = `update cliente set password = '${pass}' where cedula_cli = '${user.cedula_cli}'`
        console.log(consulta);
        const res = await pool.query(consulta);
        console.log(res);
        if (res.rowCount == 1) {
            return "Cliente Atualizado";
        } else
            return "No se pudo Actualizar el cliente";

    } catch (error) {
        return error.message;
    }
}

module.exports = {
    getGeneros,
    insertCliente,
    getClientes,
    buscarPorCed,
    updateCli
}