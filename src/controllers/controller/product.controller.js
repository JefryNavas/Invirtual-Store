const path = require("path");
const mimeTypes = require("mime-types");
const multer = require("multer");
const {
  editProd,
  getCategorias,
  insertProduct,
  getProductosTabla,
  getProductos,
} = require("../services/productService");
const { getProvedores } = require("../services/providerService");

const storage = multer.diskStorage({
  destination: "../../../public/assets/uploads",
  filename: function (req, file, cb) {
    cb("", Date.now() + "." + mimeTypes.extension(file.mimetype));
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  }
});

const producto = async (req, res) => {
  if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
    let user = req.session.user;
    let proveedor = await getProvedores();
    let categoria = await getCategorias();
    res.render("producto", {
      login: true,
      titulo: "Producto",
      tipo: user.tipo,
      name: user.nombre,
      prov: proveedor,
      categoria,
    });
  } else {
    res.redirect("/");
  }
};

// Registrar Producto
const registrarProducto = async (req, res) => {
  let user = req.session.user;
  const producto = {
    nombre: req.body.nombre,
    proveedor: req.body.proveedor,
    categoria: req.body.categoria,
    imagen: storage.filename,
    material: req.body.material,
    color: req.body.color,
    talla: req.body.talla,
    stock: req.body.stock,
    precioMer: req.body.precioMer,
    precioProv: req.body.precioProv,
  };
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, tempPath);
  let msgProducto = await insertProduct(
    producto.nombre,
    producto.proveedor,
    producto.categoria,
    targetPath,
    producto.material,
    producto.color,
    producto.talla,
    producto.stock,
    producto.precioMer,
    producto.precioProv
  );
  if (msgProducto === "Producto registrado") {
    res.render("producto", {
      tipo: user.tipo,
      alert: true,
      alertTitle: "Producto registrado correctamente",
      alertMessage: msgProducto,
      icon: "success",
      timer: 1700,
      ruta: "producto",
    });
  } else {
    res.render("producto", {
      tipo: user.tipo,
      alert: true,
      alertTitle: "Error al registrar al producto",
      alertMessage: msgProducto,
      icon: "error",
      // timer: 3700,
      ruta: "producto",
    });
  }
};
// Tabla Productos
const tablaProductos = async (req, res) => {
  if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
    let user = req.session.user;
    let product = await getProductosTabla();

    res.render("tableProductos", {
      login: true,
      titulo: "Tablas",
      tipo: user.tipo,
      name: user.nombre,
      product,
    });
  } else {
    res.redirect("/");
  }
};

const editarProducto = async (req, res) => {
  let user = req.session.user;
  const producto = {
    codigo: req.body.id,
    nombre: req.body.nombre,
    material: req.body.material,
    peso: req.body.peso,
    cm: req.body.cm,
    color: req.body.color,
    talla: req.body.talla,
    origen: req.body.origen,
    stock: req.body.stock,
    precioMer: req.body.precioMer,
    precioProv: req.body.precioProv,
  };

  const msg = await editProd(
    producto.codigo,
    producto.nombre,
    producto.material,
    producto.peso,
    producto.cm,
    producto.color,
    producto.talla,
    producto.origen,
    producto.stock,
    producto.precioMer,
    producto.precioProv
  );

  res.render("tableProductos", {
    tipo: user.tipo,
    alert: true,
    alertTitle: msg,
    icon: "success",
    timer: 1700,
    ruta: "tableProductos",
  });
};

// Muestra el producto a editar
const mostrarProducto = async (req, res) => {
  if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
    let user = req.session.user;
    const idProd = req.body.id;
    let products = await getProductos();
    let producto = products.find((obj) => obj.cod_prod == idProd);
    res.render("tableProductos", {
      login: true,
      titulo: "Tablas",
      tipo: user.tipo,
      name: user.nombre,
      producto,
    });
  } else {
    res.redirect("/");
  }
};

module.exports = {
  producto,
  registrarProducto,
  tablaProductos,
  editarProducto,
  mostrarProducto,
};
