const { authEmail } = require("../services/authService");
const moment = require("moment");

const {
  insertUser,
  getUsers,
  editUser,
  deleteUser,
  getGanancias,
  getRepartidores,
} = require("../services/employeeService");

const admin = function (req, res) {
  if (req.session.loggedinAdmin) {
    let user = req.session.user;
    res.render("admin", {
      login: true,
      titulo: "Dashboard",
      tipo: "admin",
      name: user.nombre,
    });
  } else {
    res.redirect("/");
  }
};

const empleado = function (req, res) {
  if (req.session.loggedinEmpleado) {
    let user = req.session.user;
    res.render("empleado", {
      login: true,
      tipo: "empleado",
      name: user.nombre,
    });
  } else {
    res.redirect("/");
  }
};

const repartidor = function (req, res) {
  if (req.session.loggedinRepartidor) {
    let user = req.session.user;
    res.render("repartidor", {
      login: true,
      tipo: "repartidor",
      name: user.nombre,
    });
  } else {
    res.redirect("/");
  }
};

// Registrar Empleado
const register = async (req, res) => {
  let rol = req.body.rol;
  let placa = "";
  if (rol == 3) {
    placa = req.body.placa;
  } else {
    placa = "";
  }
  const user = {
    email: req.body.user,
    name: req.body.name,
    rol,
    pass: req.body.pass,
    pass2: req.body.pass2,
    placa,
  };
  if (user.pass2 == user.pass) {
    if (await authEmail(user.email)) {
      insertUser(user.rol, user.name, user.email, user.pass, user.placa).then(
        (resp) =>
          res.render("login", {
            alert: true,
            alertTitle: "Registrado Correctamente",
            alertMessage: resp,
            icon: "success",
            timer: 1700,
            ruta: "",
          })
      );
    } else {
      res.render("login", {
        alert: true,
        alertMessage: "El email ya existe",
        icon: "error",
        timer: 1500,
        ruta: "",
      });
    }
  } else {
    res.render("login", {
      alert: true,
      alertMessage: "Las Contraseñas no coinciden",
      icon: "error",
      timer: 1500,
      ruta: "",
    });
  }
};

// Tabla Usuarios
const tableEmployee = async (req, res) => {
  if (req.session.loggedinAdmin) {
    let user = req.session.user;
    let users = await getUsers();
    res.render("tableUser", {
      login: true,
      titulo: "Tablas",
      tipo: user.tipo,
      name: user.nombre,
      users,
    });
  } else {
    res.redirect("/");
  }
};

// Editar Usuario
const editTableEmployee = async (req, res) => {
  if (req.session.loggedinAdmin) {
    let user = req.session.user;
    const idUser = req.body.id;
    let users = await getUsers();
    let usuario = users.find((obj) => obj.id_empleado == idUser);
    res.render("tableUser", {
      login: true,
      titulo: "Tablas",
      tipo: user.tipo,
      name: user.nombre,
      usuario,
    });
  } else {
    res.redirect("/");
  }
};
const editEmployee = async (req, res) => {
  let userr = req.session.user;
  const user = {
    id: req.body.id_empleado,
    email: req.body.user,
    name: req.body.name,
    rol: req.body.rol,
    pass: req.body.pass,
  };

  const msg = await editUser(
    user.id,
    user.name,
    user.rol,
    user.email,
    user.pass
  );

  res.render("tableUser", {
    tipo: userr.tipo,
    alert: true,
    alertTitle: msg,
    icon: "success",
    timer: 1700,
    ruta: "tableUser",
  });
};

const deleteEmployee = async (req, res) => {
  if (req.session.loggedinAdmin) {
    let user = req.session.user;
    const idUser = req.params.id;
    let msg = await deleteUser(idUser);
    res.render("tableUser", {
      login: true,
      titulo: "Tables",
      tipo: user.tipo,
      name: user.nombre,
      alert: true,
      alertTitle: msg,
      icon: "success",
      timer: 1500,
      ruta: "tableUser",
    });
  } else {
    res.redirect("/");
  }
};

// Tabla Ganancias Repartidor
const tablaGanancias = async (req, res) => {
  if (req.session.loggedinRepartidor) {
    let user = req.session.user;
    let codigo = user.id;
    let ganancias = await getGanancias(codigo);
    var localTime = moment().format("YYYY-MM-DD");
    var proposedDate = localTime + "T05:00:00.000Z";
    proposedDate = JSON.stringify(proposedDate);
    suma = 0;
    suma_dia = 0;
    //console.log(fecha);
    ganancias.forEach((element) => {
      fechas = JSON.stringify(element.fecha);
      if (fechas == proposedDate) {
        suma_dia += element.ganancia;
      }
      suma += element.ganancia;
    });
    res.render("tableGanancias", {
      login: true,
      titulo: "Tus Ganancias",
      tipo: user.tipo,
      name: user.nombre,
      ganancias,
      suma_dia,
      suma,
    });
  } else {
    res.redirect("/");
  }
};

const tablaRepartidores = async (req, res) => {
  if (req.session.loggedinAdmin) {
    let user = req.session.user;
    let repartidores = await getRepartidores();
    res.render("tableRepartidores", {
      login: true,
      titulo: "Repartidores",
      tipo: user.tipo,
      name: user.nombre,
      repartidores,
    });
  } else {
    res.redirect("/");
  }
};
module.exports = {
  admin,
  empleado,
  repartidor,
  register,
  tableEmployee,
  editTableEmployee,
  editEmployee,
  deleteUser,
  deleteEmployee,
  tablaGanancias,
  tablaRepartidores,
};
