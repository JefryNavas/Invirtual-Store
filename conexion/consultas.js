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
        const res = await pool.query('select pe.cod_ped, pe.fecha_entrega, pe.calle_principal,pe.calle_secundaria, pe.estado from pedido as pe  group by pe.cod_ped, pe.fecha_entrega, pe.calle_principal, pe.calle_secundaria, pe.estado');
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

const getCategorias = async() => {
    try {
        const res = await pool.query('select * from categoria_producto');
        return res.rows;

    } catch (error) {
        return error.message;
    }
}


const insertProduct = async(nombre, prov, cat, img, mate, peso, cm, color, talla, origen, stock, precioMer, precioProv) => {
    try {
        const consulta = `insert into producto (nombre_prod,id_cat,cod_prov,material,color,stock,precio_mercado,precio_proveedor,foto,cm,talla,origen,peso) values ('${nombre}','${cat}','${prov}','${mate}','${color}','${stock}','${precioMer}','${precioProv}','${img}','${cm}','${talla}','${origen}','${peso}')`
        const res = await pool.query(consulta);
        if (res.rowCount == 1) {
            return "Producto registrado";
        } else
            return "No se pudo registrar el producto";

    } catch (error) {
        return error.message;
    }
}

const getProductos = async() => {
    try {
        const res = await pool.query('select * from producto');
        return res.rows;

    } catch (error) {
        return error.message;
    }
}

const getProductosTabla = async() => {
    try {
        const res = await pool.query('select p.cod_prod, p.nombre_prod, cat.categoria, pr.nombre_prov,p.color, p.stock, p.precio_mercado, p.precio_proveedor from producto as p, categoria_producto as cat, proveedor as pr where p.id_cat = cat.id_cat and pr.cod_prov = p.cod_prov');
        return res.rows;

    } catch (error) {
        return error.message;
    }
}


const productoPorId = async(id_prod) => {
    try {
        const res = await pool.query(`select * from producto where cod_prod = '${id_prod}'`);
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
        const res = await pool.query(`select pr.nombre_prod, ped.cantidad, ped.total, cl.nombre_cli, cl.cedula_cli, cl.tlf 
        from producto as pr, pedido as ped, cliente as cl
        where ped.cod_prod = pr.cod_prod and ped.cedula_cli = cl.cedula_cli and ped.cod_ped = '${codigo}'`);
        return res.rows;

    } catch (error) {
        return error.message;
    }
}



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

const getEstadoPed = async(cod) => {
    try {
        const res = await pool.query(`select * from pedido where cod_ped = '${cod}'`);
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
const updateStockProducts = async(pedidos) => {
    let res;
    try {
        for (const i in pedidos) {
            const consulta = `update producto set stock = ${pedidos[i].stock} where cod_prod = ${pedidos[i].codigoProd}`;
            res = await pool.query(consulta);
        }

        if (res.rowCount == 1) {
            return "Stock Actualizado";
        } else
            return "Error al actualizar el Stock";

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
    buscarPorCed,
    getCategorias,
    insertProduct,
    getProductos,
    productoPorId,
    getProductosTabla,
    hacerPedido,
    getCodPedidos,
    buscarPorPedido,
    insertPago,
    updateEstado,
    insertGanancias,
    getGanancias,
    pagoPorId,
    updatePago,
    getCodPedidosSS,
    buscarPorPedidoSS,
    getEstadoPed,
    getRepartidores,
    updateStockProducts,
    registrarFactura,
    authEmailCli,
    updateCli,
    authCli
}