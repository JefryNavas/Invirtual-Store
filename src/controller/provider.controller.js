const {
  getProvedores,
  insertProv,
  deleteProv,
} = require("../services/providerService");

const proveedor = function (req, res) {
  if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
    let user = req.session.user;
    res.render("proveedor", {
      login: true,
      titulo: "Nuevo Proveedor",
      tipo: user.tipo,
      name: user.nombre,
    });
  } else {
    res.redirect("/");
  }
};
// Tabla Proveedor
const tablaProveedor = async (req, res) => {
  if (req.session.loggedinAdmin) {
    let user = req.session.user;
    let prov = await getProvedores();

    res.render("tableProvee", {
      login: true,
      titulo: "Tablas",
      tipo: user.tipo,
      name: user.nombre,
      prov,
    });
  } else {
    res.redirect("/");
  }
};

//Eliminar Proveedor
const deleteProveedor = async (req, res) => {
  if (req.session.loggedinAdmin) {
    let user = req.session.user;
    const idprov = req.params.id;
    let msg = await deleteProv(idprov);
    res.render("tableProvee", {
      login: true,
      titulo: "Tables",
      tipo: user.tipo,
      name: user.nombre,
      alert: true,
      alertTitle: msg,
      icon: "success",
      timer: 1500,
      ruta: "tableProvee",
    });
  } else {
    res.redirect("/");
  }
};

// Registrar Proveedor
const registrarProveedor = async (req, res) => {
  let user = req.session.user;
  const prove = {
    name: req.body.name,
  };
  // Insertar en la base de datos y mensaje
  await insertProv(prove.name).then((resp) =>
    res.render("proveedor", {
      tipo: user.tipo,
      alert: true,
      alertTitle: "Registrado Correctamente",
      alertMessage: resp,
      icon: "success",
      timer: 1500,
      ruta: "proveedor",
    })
  );
};

module.exports = {
  proveedor,
  tablaProveedor,
  deleteProveedor,
  registrarProveedor,
};
