const { pool } = require("../../model/connection/conexion")
const editProd = async(id, nombre, material, color, talla, stock, precioMer, precioProv) => {
    try {
        const consulta = `update producto set nombre_prod = '${nombre}', material = '${material}', color = '${color}', stock = ${stock}, precio_mercado = ${precioMer}, precio_proveedor = ${precioProv},talla = '${talla}' where cod_prod = ${id}`
        const res = await pool.query(consulta);
        if (res.rowCount == 1) {
            return "Producto Modificado Correctamente";
        } else
            return "No existe el Producto";
    } catch (error) {
        console.log(error.message)
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


const insertProduct = async(nombre, prov, cat, img, mate, color, talla, stock, precioMer, precioProv) => {
    try {
        const consulta = `insert into producto (nombre_prod,id_cat,cod_prov,material,color,stock,precio_mercado,precio_proveedor,foto,talla) values ('${nombre}','${cat}','${prov}','${mate}','${color}','${stock}','${precioMer}','${precioProv}','${img}','${talla}')`
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
        const res = await pool.query('select p.cod_prod, p.cod_prod, p.nombre_prod, cat.categoria, pr.nombre_prov,p.color, p.stock, p.precio_mercado, p.precio_proveedor from producto as p, categoria_producto as cat, proveedor as pr where p.id_cat = cat.id_cat and pr.cod_prov = p.cod_prov');
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

module.exports = {
    editProd,
    getCategorias,
    insertProduct,
    getProductos,
    getProductosTabla,
    productoPorId,
    updateStockProducts
}