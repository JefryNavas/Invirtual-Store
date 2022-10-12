const { pool } = require("../../src/connection/conexion")
const { fechaActual } = require('../helpers/cluster');

const getCodPedidos = async() => {
    try {
        const res = await pool.query('select pe.cod_ped, pe.fecha_entrega, pe.calle_principal,pe.calle_secundaria, pe.estado, pa.saldo from pedido as pe, pagos as pa where pe.cod_ped = pa.cod_ped group by pe.cod_ped, pe.fecha_entrega, pe.calle_principal, pe.calle_secundaria, pe.estado, pa.saldo');
        return res.rows;

    } catch (error) {
        return error.message;
    }
}

const getCodPedidosSS = async() => {
    try {
        const res = await pool.query('select pe.cod_ped, pe.fecha_entrega, pe.calle_principal,pe.calle_secundaria, pe.estado, pe.conductor from pedido as pe  group by pe.cod_ped, pe.fecha_entrega, pe.calle_principal, pe.calle_secundaria, pe.estado, pe.conductor');
        return res.rows;

    } catch (error) {
        return error.message;
    }
}

const hacerPedido = async(pedidos) => {
    let res;
    try {
        for (const i in pedidos) {
            const consulta = `insert into pedido(cantidad,total,estado,cod_prod,cedula_cli,cod_ped,fecha_entrega,calle_principal,calle_secundaria) 
            values (${pedidos[i].cant},${pedidos[i].total},'${pedidos[i].estado}',${pedidos[i].codigoProd},'${pedidos[i].id_cliente}','${pedidos[i].cod_pedido}','${pedidos[i].fecha}','${pedidos[i].principal}','${pedidos[i].secundaria}')`;
            res = await pool.query(consulta);
        }

        if (res.rowCount == 1) {
            return "Pedido registrado";
        } else
            return "No se pudo registrar el pedido";

    } catch (error) {
        return error.message;
    }
}


const buscarPorPedido = async(codigo) => {
    try {
        const res = await pool.query(`select pr.nombre_prod, ped.cantidad, ped.total, cl.nombre_cli, cl.cedula_cli, cl.tlf, pag.saldo 
        from producto as pr, pedido as ped, cliente as cl, pagos as pag
        where ped.cod_prod = pr.cod_prod and ped.cedula_cli = cl.cedula_cli and pag.cod_ped = ped.cod_ped and ped.cod_ped = '${codigo}'`);
        return res.rows;

    } catch (error) {
        return error.message;
    }
}

const buscarPorPedidoSS = async(codigo) => {
    try {
        const res = await pool.query(`select pr.nombre_prod, ped.fecha_entrega, ped.cantidad, ped.total, cl.nombre_cli, cl.cedula_cli, cl.tlf, ped.conductor,ped.estado
        from producto as pr, pedido as ped, cliente as cl
        where ped.cod_prod = pr.cod_prod and ped.cedula_cli = cl.cedula_cli and ped.cod_ped = '${codigo}'`);
        return res.rows;

    } catch (error) {
        return error.message;
    }
}

const updateEstado = async(codigo_ped, metodo) => {
    try {
        const consulta = `update pedido set estado = 'Entregado-${metodo}' where cod_ped = '${codigo_ped}'`
        const res = await pool.query(consulta);
        if (res.rowCount == 1) {
            return "Estado Actualizado";
        } else
            return "No se pudo actualizar el estado";
    } catch (error) {
        return error.message;
    }
}

const getEstadoPed = async(cod) => {
    try {
        const res = await pool.query(`select * from pedido where cod_ped = '${cod}'`);
        return res.rows;

    } catch (error) {
        return error.message;
    }
}

const pedidosPorCliente = async(cedula) => {
    try {
        const res = await pool.query(`select pe.cod_ped, pe.fecha_entrega, pe.cedula_cli, pe.calle_principal, pe.calle_secundaria, pe.estado
        from pedido as pe where pe.cedula_cli = '${cedula}'
        group by pe.cod_ped, pe.fecha_entrega, pe.calle_principal, pe.calle_secundaria, pe.estado, pe.cedula_cli, pe.estado`);
        return res.rows;

    } catch (error) {
        return error.message;
    }
}

const getCodPedidosCliente = async(cedula) => {
    try {
        const res = await pool.query(`select pe.cod_ped, pe.fecha_entrega, pe.calle_principal,pe.calle_secundaria, pe.estado, pa.saldo from pedido as pe, pagos as pa 
        where pe.cod_ped = pa.cod_ped and pe.cedula_cli = '${cedula}' and pa.saldo >0
        group by pe.cod_ped, pe.fecha_entrega, pe.calle_principal, pe.calle_secundaria, pe.estado, pa.saldo`);
        return res.rows;

    } catch (error) {
        return error.message;
    }
}

const updateEstadoConductor = async(codigo_ped) => {
    try {
        const consulta = `update pedido set estado = 'Conductor en Camino' where cod_ped = '${codigo_ped}'`
        const res = await pool.query(consulta);
        if (res.rowCount == 1) {
            return "Estado Actualizado";
        } else
            return "No se pudo actualizar el estado";
    } catch (error) {
        return error.message;
    }
}

const getPedidosActual = async() => {
    try {
        const res = await pool.query(`select pe.cod_ped, pe.fecha_entrega, pe.calle_principal,pe.calle_secundaria, pe.estado from pedido as pe where pe.fecha_entrega = '${fechaActual()}' and pe.estado = 'Pedido Registrado' group by pe.cod_ped, pe.fecha_entrega, pe.calle_principal, pe.calle_secundaria, pe.estado`);
        return res.rows;

    } catch (error) {
        return error.message;
    }
}

const getCodPedidosSSRepartidor = async(id) => {
    try {
        const res = await pool.query(`select pe.cod_ped, pe.fecha_entrega, pe.calle_principal,pe.calle_secundaria, pe.estado, pe.conductor 
        from pedido as pe  where pe.conductor = ${id}
        group by pe.cod_ped, pe.fecha_entrega, pe.calle_principal, pe.calle_secundaria, pe.estado, pe.conductor
        `);
        return res.rows;

    } catch (error) {
        return error.message;
    }
}

const getNoEntregados = async() => {
    try {
        const res = await pool.query(`select pe.cod_ped, pe.fecha_entrega, pe.calle_principal,pe.calle_secundaria, pe.estado, pe.conductor from pedido as pe 
        where pe.estado = 'Pedido Registrado' or pe.estado = 'No Entregado'
        group by pe.cod_ped, pe.fecha_entrega, pe.calle_principal, pe.calle_secundaria, pe.estado, pe.conductor`);
        return res.rows;

    } catch (error) {
        return error.message;
    }
}

const getAsigandos = async() => {
    try {
        const res = await pool.query(`select pe.cod_ped, pe.fecha_entrega, pe.calle_principal,pe.calle_secundaria, pe.estado, pe.conductor,emp.nombre
        from pedido as pe, empleado as emp
        where emp.id_empleado = pe.conductor
        group by pe.cod_ped, pe.fecha_entrega, pe.calle_principal, pe.calle_secundaria, pe.estado, pe.conductor,emp.nombre`);
        return res.rows;

    } catch (error) {
        return error.message;
    }
}

module.exports = {
    getCodPedidos,
    getCodPedidosSS,
    hacerPedido,
    buscarPorPedido,
    buscarPorPedidoSS,
    updateEstado,
    getEstadoPed,
    pedidosPorCliente,
    getCodPedidosCliente,
    updateEstadoConductor,
    getPedidosActual,
    getCodPedidosSSRepartidor,
    getNoEntregados,
    getAsigandos
}