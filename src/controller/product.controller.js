const path = require("path");
const mimeTypes = require("mime-types");
const multer = require("multer");
const { getCategorias, insertProduct } = require("../services/productService");
const { getProvedores } = require("../services/providerService");

const storage = multer.diskStorage({
    destination: '../../uploads/',
    filename: function(req, file, cb) {
        cb("", Date.now() + "." + mimeTypes.extension(file.mimetype));
    }
});


const producto = async(req, res) => {
    if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
        let user = req.session.user;
        let proveedor = await getProvedores();
        let categoria = await getCategorias();
        res.render('producto', {
            login: true,
            titulo: 'Producto',
            tipo: user.tipo,
            name: user.nombre,
            prov: proveedor,
            categoria
        });
    } else {
        res.redirect('/')
    }
};

// Registrar Producto
const registrarProducto = async(req, res) => {
    let user = req.session.user;
    const producto = {
        //codigo: req.body.codigo,
        nombre: req.body.nombre,
        proveedor: req.body.proveedor,
        categoria: req.body.categoria,
        imagen: storage.filename,
        material: req.body.material,
        peso: req.body.peso,
        cm: req.body.cm,
        color: req.body.color,
        talla: req.body.talla,
        origen: req.body.origen,
        stock: req.body.stock,
        precioMer: req.body.precioMer,
        precioProv: req.body.precioProv
    };
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, tempPath);
    let msg = await insertProduct(producto.nombre, producto.proveedor, producto.categoria,
        targetPath, producto.material, producto.peso, producto.cm, producto.color,
        producto.talla, producto.origen, producto.stock, producto.precioMer, producto.precioProv);

    res.render('producto', {
        tipo: user.tipo,
        alert: true,
        alertTitle: msg,
        icon: 'success',
        timer: 1700,
        ruta: 'producto'
    })

};

module.exports = {
    producto,
    registrarProducto
}