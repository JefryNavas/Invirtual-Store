const { pool } = require("../connection/conexion")

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

export default {
    getProvedores,
    insertProv,
    deleteProv
}