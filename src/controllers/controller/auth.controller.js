const { authUser } = require("../services/authService");

const login = function (req, res) {
  res.render("login", {
    titulo: "Login",
  });
};

// Autenticar Empleado
const authEmployee = async (req, res) => {
  const user = req.body.user;
  const pass = req.body.pass;
  if (user && pass) {
    const authe = await authUser(user, pass);
    if (authe == false) {
      res.render("login", {
        alert: true,
        alertTitle: "Error",
        alertMessage: "Usuario y/o Contraseña incorrectas",
        icon: "error",
        showConfirmButton: true,
        ruta: "",
      });
    } else {
      let Ruta;
      if (authe[0].id_tipo == "2") {
        req.session.loggedinEmpleado = true;
        Ruta = "empleado";
      } else if (authe[0].id_tipo == "3") {
        req.session.loggedinRepartidor = true;
        Ruta = "repartidor";
      } else if (authe[0].id_tipo == "1") {
        req.session.loggedinAdmin = true;
        Ruta = "admin";
      }
      req.session.user = {
        nombre: authe[0].nombre,
        email: authe[0].email,
        tipo: authe[0].id_tipo,
        id: authe[0].id_empleado,
      };
      req.session.productos = [];
      req.session.cliente;
      req.session.cod_pedido;
      req.session.nuevoPro;
      res.render("login", {
        alert: true,
        alertTitle: "Conexion Exitosa",
        alertMessage: "Login Correcto",
        icon: "success",
        timer: 1500,
        ruta: Ruta,
      });
    }
  }
};

// Logout del usuario
const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

module.exports = {
  login,
  authEmployee,
  logout,
};
