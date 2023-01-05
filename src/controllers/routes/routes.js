const express = require("express");
const {
  cliente,
  tablaClientes,
  registerCliente,
  buscarCliente,
  actulizarCliente,
  authCliente,
  client,
} = require("../controller/client.controller");
const {
  empleado,
  repartidor,
  admin,
  register,
  tableEmployee,
  editTableEmployee,
  editEmployee,
  deleteEmployee,
  tablaGanancias,
  tablaRepartidores,
} = require("../controller/employee.controller");
const {
  login,
  authEmployee,
  logout,
} = require("../controller/auth.controller");
const {
  pedido,
  nuevoPedido,
  addProducto,
  quitarProducto,
  hacerPedidoView,
  tablaPedidos,
  asignadosTodos,
  asignadosResumen,
  repartirPedidos,
  seguimientoPedido,
  tusPedidosCliente,
  tusPedidosResumen,
  tablaPedidosNoEntregados,
  pedidoNoEntregadoResumen,
  tablaPedidosPendientesPago,
  pedidoPendientePagoResumen,
  pedidosResumen,
  tablaPedidosRepartidor,
  pedidoRepartidorResumen,
} = require("../controller/order.controller");
const {
  producto,
  registrarProducto,
  tablaProductos,
  editarProducto,
  mostrarProducto,
} = require("../controller/product.controller");
const {
  proveedor,
  tablaProveedor,
  deleteProveedor,
  registrarProveedor,
} = require("../controller/provider.controller");
const router = express.Router();
const multer = require("multer");
const mimeTypes = require("mime-types");
const {
  pagos,
  registrarPagos,
  facturasCliente,
  facturaResumenCliente,
  tablaFacturas,
  facturaResumen,
  pagosPendientesCliente,
  pagosPendientesResumen,
  registrarFact,
  vistaPagoAdministrador,
  vistaPagoRepartidor,
} = require("../controller/payment.controller");

const storage = multer.diskStorage({
  destination: "../../../public/assets/uploads",
  filename: function (req, file, cb) {
    cb("", Date.now() + "." + mimeTypes.extension(file.mimetype));
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  }
});

const upload = multer({
  storage: storage,
});

router.get("/", login);
router.get("/admin", admin);
router.get("/empleado", empleado);
router.get("/repartidor", repartidor);
router.get("/cliente", cliente);
router.get("/producto", producto);
router.get("/pedido", pedido);
router.get("/proveedor", proveedor);
router.get("/register", register);
router.post("/producto", upload.single("imagen"), registrarProducto);
router.post("/auth", authEmployee);
router.get("/logout", logout);
router.get("/tableUser", tableEmployee);
router.post("/tableUser", editTableEmployee);
router.post("/editUser", editEmployee);
router.get("/tableProvee", tablaProveedor);
router.get("/tableClientes", tablaClientes);
router.get("/deleteUser/:id", deleteEmployee);
router.get("/deleteProv/:id", deleteProveedor);
router.post("/regprov", registrarProveedor);
router.post("/regcli", registerCliente);
router.post("/buscarcli", buscarCliente);
router.post("/addprod", addProducto);
router.post("/nuevoPedido", nuevoPedido);
router.post("/quitarProd", quitarProducto);
router.post("/hacerPedido", hacerPedidoView);
router.get("/pagos", pagos);
router.post("/regpago", registrarPagos);
router.get("/tablePedidos", tablaPedidos);
router.get("/tableGanancias", tablaGanancias);
router.get("/tableRepartidores", tablaRepartidores);
router.post("/updateCli", actulizarCliente);
router.post("/authCliente", authCliente);
router.get("/client", client);
router.get("/tusPedidos", tusPedidosCliente);
router.post("/tusPedidos", tusPedidosResumen);
router.post("/editProd", editarProducto);
router.get("/tableAsignados", asignadosTodos);
router.post("/tableAsignados", asignadosResumen);
router.get("/tableProductos", tablaProductos);
router.post("/tableProductos", mostrarProducto);
router.post("/repartirPedidos", repartirPedidos);
router.post("/seguimiento", seguimientoPedido);
router.get("/tusFacturas", facturasCliente);
router.post("/tusFacturas", facturaResumenCliente);
router.get("/tableFacturas", tablaFacturas);
router.post("/tableFacturas", facturaResumen);
router.get("/pendientesCliente", pagosPendientesCliente);
router.post("/pendientesCliente", pagosPendientesResumen);
router.post("/regfactura", registrarFact);
router.get("/tableNoEntregados", tablaPedidosNoEntregados);
router.post("/tableNoEntregados", pedidoNoEntregadoResumen);
router.get("/tablePendientes", tablaPedidosPendientesPago);
router.post("/tablePendientes", pedidoPendientePagoResumen);
router.post("/tablePedidos", pedidosResumen);
router.get("/listaPedidos", tablaPedidosRepartidor);
router.post("/listaPedidos", pedidoRepartidorResumen);
router.post("/pagos", vistaPagoAdministrador);
router.post("/pagoss", vistaPagoRepartidor);

module.exports = router;
