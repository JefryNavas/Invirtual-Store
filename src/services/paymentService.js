const { pool } = require("../../src/connection/conexion")

const insertPago = async(fecha, cedula, monto, saldo, tipo_pago, forma, empleado, cod_pedido) => {
    try {
        const consulta = `insert into pagos(fecha,cedula_cli,monto_rec,saldo,tipo_pago,forma_pago,id_empleado,cod_ped) values ('${fecha}','${cedula}','${monto}','${saldo}','${tipo_pago}','${forma}','${empleado}','${cod_pedido}')`
        const res = await pool.query(consulta);
        if (res.rowCount == 1) {
            return "Pago Registrado";
        } else
            return "No se pudo registrar el pago";

    } catch (error) {
        return error.message;
    }
}

const pagoPorId = async(cod_ped) => {
    try {
        const res = await pool.query(`select * from pagos where cod_ped = '${cod_ped}'`);
        return res.rows;

    } catch (error) {
        return error.message;
    }
}

const updatePago = async(codigo_ped, monto, saldo) => {
    try {
        const consulta = `update pagos set monto_rec = '${monto}', saldo = '${saldo}' where cod_ped = '${codigo_ped}'`
        const res = await pool.query(consulta);
        if (res.rowCount == 1) {
            return "Saldo Actualizado";
        } else
            return "No se pudo actualizar";
    } catch (error) {
        return error.message;
    }
}

const registrarFactura = async(factura) => {
    try {
        const consulta = `insert into factura(fecha_fac,cedula_cli,direccion,subtotal,total,nombre,email,cod_pedido,telefono) values ('${factura.fecha}','${factura.cedula}','${factura.direccion}','${factura.subtotal}','${factura.total}','${factura.nombre}','${factura.email}','${factura.cod_pedido}','${factura.telefono}')`
        const res = await pool.query(consulta);
        if (res.rowCount == 1) {
            return "Factura Registrada";
        } else
            return "No se pudo registrar la factura";

    } catch (error) {
        return error.message;
    }
}

const getFacturaCliente = async(codigo) => {
    try {
        const res = await pool.query(`select id_fac, fecha_fac,total,cod_pedido from factura where cedula_cli = '${codigo}'`);
        return res.rows;

    } catch (error) {
        return error.message;
    }
}

const getFactura = async(codigo) => {
    try {
        const res = await pool.query(`select id_fac, fecha_fac,total,cod_pedido from factura`);
        return res.rows;

    } catch (error) {
        return error.message;
    }
}

const getResumenFactura = async(codigo) => {
    try {
        const res = await pool.query(`select * from factura where id_fac = '${codigo}'`);
        return res.rows;

    } catch (error) {
        return error.message;
    }
}

module.exports = {
    insertPago,
    pagoPorId,
    updatePago,
    registrarFactura,
    getFacturaCliente,
    getFactura,
    getResumenFactura
}