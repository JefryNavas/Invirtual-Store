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


const getCodPedidos = async() => {
    try {
        const res = await pool.query('select cod_ped, fecha_entrega from pedido group by cod_ped, fecha_entrega');
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
            const consulta = `insert into pedido(cantidad,total,estado,cod_prod,cedula_cli,cod_ped,fecha_entrega,calle_principal,calle_secundaria) values (${pedidos[i].cant},${pedidos[i].total},'${pedidos[i].estado}',${pedidos[i].codigoProd},'${pedidos[i].id_cliente}','${pedidos[i].cod_pedido}','${pedidos[i].fecha}','${pedidos[i].principal}','${pedidos[i].secundaria}')`;
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
        const res = await pool.query(`select pr.nombre_prod, ped.cantidad, ped.total, cl.nombre_cli, cl.tlf from producto as pr, pedido as ped, cliente as cl where ped.cod_prod = pr.cod_prod and ped.cedula_cli = cl.cedula_cli
        and ped.cod_ped = '${codigo}'`);
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
    buscarPorCed,
    getCategorias,
    insertProduct,
    getProductos,
    productoPorId,
    getProductosTabla,
    hacerPedido,
    getCodPedidos,
    buscarPorPedido
}