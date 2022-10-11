const { pool } = require("../connection/conexion")
const getUsers = async() => {
    try {
        const res = await pool.query('select id_empleado,empleado.id_tipo,nombre_tipo,nombre,email,password from empleado,tipo_empleado where empleado.id_tipo = tipo_empleado.id_tipo');
        return res.rows;

    } catch (error) {
        return error.message;
    }
}
const insertUser = async(tipo, nombre, email, password, placa) => {

    try {
        const consulta = `insert into empleado(id_tipo,nombre,email,password,placa) values ('${tipo}','${nombre}','${email}','${password}','${placa}')`
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

const insertGanancias = async(id_empleado, cod_pedido, fecha, ganancia) => {
    try {
        const consulta = `insert into ganancias (id_empleado,cod_pedido,fecha,ganancia)  values ('${id_empleado}','${cod_pedido}','${fecha}','${ganancia}')`
        const res = await pool.query(consulta);
        if (res.rowCount == 1) {
            return "Ganancia guardada";
        } else
            return "Ganancia guardada";

    } catch (error) {
        return error.message;
    }
}

const getGanancias = async(id_empleado) => {
    try {
        const res = await pool.query(`select * from ganancias where id_empleado = '${id_empleado}'`);
        return res.rows;

    } catch (error) {
        return error.message;
    }
}

const getRepartidores = async() => {
    try {
        const res = await pool.query(`select gan.id_empleado, emp.nombre, emp.email, gan.fecha, sum(gan.ganancia) as ganancia_total from ganancias as gan, empleado as emp 
        where gan.id_empleado = emp.id_empleado  GROUP BY(gan.id_empleado,emp.nombre, gan.fecha,emp.email)`);
        return res.rows;

    } catch (error) {
        return error.message;
    }
}

const getAllRepartidores = async() => {
    try {
        const res = await pool.query(`select * from empleado where id_tipo = 3`);
        return res.rows;

    } catch (error) {
        return error.message;
    }
}
const updateConductor = async(data) => {
    let res;
    try {
        for (const i in data) {
            const consulta = `update pedido set estado = 'Conductor Asignado',conductor = '${data[i].Repartidor}' where cod_ped = '${data[i].cod_pedido}'`;
            res = await pool.query(consulta);
        }

        return true;

    } catch (error) {
        return error.message;
    }
}

const getDatosConductor = async(id_cond) => {
    try {
        const res = await pool.query(`select * from empleado where id_empleado = '${id_cond}'`);
        return res.rows;

    } catch (error) {
        return error.message;
    }
}

export default {
    getUsers,
    insertUser,
    deleteUser,
    editUser,
    insertGanancias,
    getGanancias,
    getRepartidores,
    getAllRepartidores,
    updateConductor,
    getDatosConductor
}