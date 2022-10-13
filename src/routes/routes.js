const express = require("express");
const { cliente } = require("../controller/client.controller");
const {
    empleado,
    repartidor,
    admin,
    register,
    tableEmployee,
    editTableEmployee,
    editEmployee
} = require("../controller/employee.controller");
const { login, authEmployee, logout } = require("../controller/auth.controller");
const { pedido } = require("../controller/order.controller");
const { producto, registrarProducto } = require("../controller/product.controller");
const { proveedor } = require("../controller/provider.controller");
const router = express.Router();
const multer = require("multer");
const mimeTypes = require("mime-types");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb("", Date.now() + "." + mimeTypes.extension(file.mimetype));
    }
})

const upload = multer({
    storage: storage
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
router.post("/producto", upload.single('imagen'), registrarProducto);
router.post("/auth", authEmployee);
router.get("/logout", logout);
router.get('/tableUser', tableEmployee);
router.post('/tableUser', editTableEmployee);
router.post('/editUser', editEmployee);

module.exports = router;