const {
  getGeneros,
  insertCliente,
  getClientes,
  buscarPorCed,
  updateCli,
} = require("../services/clientService");

const { authCli, authEmailCli } = require("../services/authService");

const cliente = async (req, res) => {
  if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
    let user = req.session.user;
    let genero = await getGeneros();
    res.render("cliente", {
      login: true,
      titulo: "Cliente",
      tipo: user.tipo,
      name: user.nombre,
      genero,
    });
  } else {
    res.redirect("/");
  }
};

// Tabla Clientes
const tablaClientes = async (req, res) => {
  if (req.session.loggedinAdmin) {
    let user = req.session.user;
    let client = await getClientes();

    res.render("tableClientes", {
      login: true,
      titulo: "Tablas",
      tipo: user.tipo,
      name: user.nombre,
      client,
    });
  } else {
    res.redirect("/");
  }
};

// Registrar Cliente
const registerCliente = async (req, res) => {
  let user = req.session.user;
  const cli = {
    cedula: req.body.ced,
    name: req.body.name,
    email: req.body.email,
    edad: req.body.edad,
    gen: req.body.genero,
    tel: req.body.tel,
    medio: req.body.medio,
  };
  // Insertar en la base de datos y mensaje
  await insertCliente(
    cli.cedula,
    cli.name,
    cli.email,
    cli.edad,
    cli.gen,
    cli.tel,
    cli.medio
  ).then((resp) =>
    res.render("cliente", {
      tipo: user.tipo,
      alert: true,
      alertTitle: "Registrado Correctamente",
      alertMessage: resp,
      icon: "success",
      timer: 1500,
      ruta: "cliente",
    })
  );
};
// Buscar CLiente
const buscarCliente = async (req, res) => {
  if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
    let user = req.session.user;
    let cedula = req.body.cedula;
    let cliente = await buscarPorCed(cedula);
    if (cliente[0]) {
      req.session.cliente = cliente[0];
      res.render("pedido", {
        login: true,
        titulo: "Pedido",
        tipo: user.tipo,
        name: user.nombre,
        cliente: req.session.cliente,
        prod: req.session.prod,
        nuevoP: req.session.nuevoPro,
      });
    } else {
      req.session.nuevoPro = false;
      res.render("pedido", {
        tipo: user.tipo,
        alert: true,
        alertMessage: "No existe el Usuario buscado",
        icon: "error",
        timer: 1700,
        ruta: "pedido",
        nuevoP: req.session.nuevoPro,
      });
    }
  }
};

const actulizarCliente = async (req, res) => {
  const user = {
    email: req.body.user,
    pass: req.body.pass,
    pass2: req.body.pass2,
  };
  // Insertar en la base de datos y mensaje
  if (user.pass2 == user.pass) {
    let usuario = await authEmailCli(user.email);
    if (usuario[0]) {
      updateCli(usuario[0], user.pass).then((resp) =>
        res.render("login", {
          alert: true,
          alertTitle: "Usuario actualizado Correctamente",
          alertMessage: resp,
          icon: "success",
          timer: 1700,
          ruta: "",
        })
      );
    } else {
      res.render("login", {
        alert: true,
        alertMessage: "El usuario no se ha registrado",
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
const authCliente = async (req, res) => {
  const user = req.body.user;
  const pass = req.body.pass;
  //let passhash = await bcryptjs.hash(pass, 8);

  if (user && pass) {
    const authe = await authCli(user, pass);
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
      req.session.loggedinCliente = true;

      req.session.user = {
        nombre: authe[0].nombre_cli,
        email: authe[0].email,
        tipo: 4,
        id: authe[0].cedula_cli,
      };
      res.render("login", {
        alert: true,
        alertTitle: "Conexion Exitosa",
        alertMessage: "Login Correcto",
        icon: "success",
        timer: 1500,
        ruta: "client",
      });
    }
  }
};

const client = function (req, res) {
  if (req.session.loggedinCliente) {
    let user = req.session.user;
    res.render("client", {
      login: true,
      titulo: "Inicio",
      tipo: "cliente",
      name: user.nombre,
    });
  } else {
    res.redirect("/");
  }
};

module.exports = {
  cliente,
  tablaClientes,
  registerCliente,
  buscarCliente,
  actulizarCliente,
  authCliente,
  client,
};
