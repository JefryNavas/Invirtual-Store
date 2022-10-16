const date = require("date-and-time");
const {
  buscarPorPedidoSS,
  updateEstado,
  buscarPorPedido,
  getCodPedidosCliente,
  updateEstadoConductor,
} = require("../services/orderService");
const { buscarPorCed } = require("../services/clientService");
const { insertGanancias } = require("../services/employeeService");
const {
  insertPago,
  pagoPorId,
  updatePago,
  getFacturaCliente,
  getResumenFactura,
  getFactura,
  registrarFactura,
} = require("../services/paymentService");

const pagos = function (req, res) {
  if (req.session.loggedinRepartidor || req.session.loggedinAdmin) {
    let user = req.session.user;
    res.render("pagos", {
      login: true,
      titulo: "Pagos",
      tipo: user.tipo,
      name: user.nombre,
    });
  } else {
    res.redirect("/");
  }
};

// Registrar Pagos
const registrarPagos = async (req, res) => {
  let user = req.session.user;
  const now = new Date();
  let fecha = date.format(now, "ddd, MMM DD YYYY");
  let total = parseInt(req.body.total, 10);
  let monto = parseInt(req.body.monto, 10);
  let saldo = total - monto;
  let idUser = user.id;
  let codigo = req.body.codigop;
  let resumen = await buscarPorPedidoSS(codigo);
  let rp = "";
  let estado = "";
  if (saldo > 1) {
    rp = `Cuota Registrada, Saldo Pendiente de: $${saldo} `;
    estado = "Pago Parcial";
  } else {
    rp = "Pago Registrado";
    estado = "Cancelado";
  }
  let win = 0;
  if (total >= 60) {
    win = 5;
  } else {
    win = 3;
  }

  const cli = {
    fecha,
    monto,
    saldo,
    tipo: req.body.tipo,
    forma: req.body.forma,
    idUser,
    codigo,
    cedula: resumen[0].cedula_cli,
    win,
  };
  let actualizar = await updateEstado(codigo, estado);
  let cliente = await buscarPorCed(cli.cedula);
  let iva = (cli.monto * 12) / 100;
  let subtotal = cli.monto - iva;
  if (user.tipo == 3) {
    let ganancias = await insertGanancias(
      cli.idUser,
      cli.codigo,
      cli.fecha,
      cli.win
    );
    // Insertar en la base de datos y mensaje
    await insertPago(
      cli.fecha,
      cli.cedula,
      cli.monto,
      cli.saldo,
      cli.tipo,
      cli.forma,
      cli.idUser,
      cli.codigo
    ).then((resp) =>
      res.render("factura", {
        login: true,
        tipo: user.tipo,
        name: user.nombre,
        alert: true,
        alertTitle: rp,
        alertMessage: actualizar,
        icon: "success",
        timer: 2500,
        ruta: "factura",
        actualizar,
        ganancias,
        resumen,
        cliente: cliente[0],
        total: cli.monto,
        subtotal,
        cod_pedido: cli.codigo,
      })
    );
  } else {
    // Insertar en la base de datos y mensaje
    let datos = await pagoPorId(cli.codigo);
    let newmonto = datos[0].monto_rec + cli.monto;
    let newsaldo = saldo;

    await updatePago(cli.codigo, newmonto, newsaldo).then((resp) =>
      res.render("factura", {
        login: true,
        tipo: user.tipo,
        name: user.nombre,
        alert: true,
        alertTitle: rp,
        alertMessage: "Correcto",
        icon: "success",
        timer: 2500,
        actualizar,
        resumen,
        cliente: cliente[0],
        total: cli.monto,
        subtotal,
        cod_pedido: cli.codigo,
      })
    );
  }
};

// Tabla facturas del cliente
const facturasCliente = async (req, res) => {
  if (req.session.loggedinCliente) {
    let user = req.session.user;
    let cedula = user.id;
    let facturas = await getFacturaCliente(cedula);
    res.render("tusFacturas", {
      login: true,
      titulo: "Facturas",
      tipo: "cliente",
      name: user.nombre,
      facturas,
    });
  } else {
    res.redirect("/");
  }
};

// Resumen Facturas del cliente
const facturaResumenCliente = async (req, res) => {
  if (req.session.loggedinCliente) {
    let user = req.session.user;
    const codigo = req.body.id;
    let resumen = await getResumenFactura(codigo);
    let codped = resumen[0].cod_pedido;
    let detalle = await buscarPorPedido(codped);
    res.render("tusFacturas", {
      login: true,
      titulo: "Detalle Factura",
      tipo: user.tipo,
      name: user.nombre,
      codped,
      resumen,
      fecha: resumen[0].fecha_fac,
      nombre: resumen[0].nombre,
      cedula: resumen[0].cedula_cli,
      direccion: resumen[0].direccion,
      email: resumen[0].email,
      tlf: resumen[0].telefono,
      subtotal: resumen[0].subtotal,
      total: resumen[0].total,
      detalle,
    });
  } else {
    res.redirect("/");
  }
};

// Tabla todas las facturas
const tablaFacturas = async (req, res) => {
  if (req.session.loggedinAdmin) {
    let user = req.session.user;
    let facturas = await getFactura();
    res.render("tableFacturas", {
      login: true,
      titulo: "Facturas",
      tipo: "cliente",
      name: user.nombre,
      facturas,
    });
  } else {
    res.redirect("/");
  }
};

// Resumen de la facturas
const facturaResumen = async (req, res) => {
  if (req.session.loggedinAdmin) {
    let user = req.session.user;
    const codigo = req.body.id;
    let resumen = await getResumenFactura(codigo);
    let codped = resumen[0].cod_pedido;
    let detalle = await buscarPorPedido(codped);
    res.render("tableFacturas", {
      login: true,
      titulo: "Detalle Factura",
      tipo: user.tipo,
      name: user.nombre,
      codped,
      resumen,
      fecha: resumen[0].fecha_fac,
      nombre: resumen[0].nombre,
      cedula: resumen[0].cedula_cli,
      direccion: resumen[0].direccion,
      email: resumen[0].email,
      tlf: resumen[0].telefono,
      subtotal: resumen[0].subtotal,
      total: resumen[0].total,
      detalle,
    });
  } else {
    res.redirect("/");
  }
};

// Pagos pendientes del Cliente
const pagosPendientesCliente = async (req, res) => {
  if (req.session.loggedinCliente) {
    let user = req.session.user;
    let cedula = user.id;
    let codped = await getCodPedidosCliente(cedula);
    res.render("pendientesCliente", {
      login: true,
      titulo: "Pendientes",
      tipo: "cliente",
      name: user.nombre,
      codped,
    });
  } else {
    res.redirect("/");
  }
};

// Resumen pago pendiente del Cliente
const pagosPendientesResumen = async (req, res) => {
  if (req.session.loggedinCliente) {
    let user = req.session.user;
    const codigo = req.body.id;
    let resumen = await buscarPorPedido(codigo);
    let a_pagar = 0;
    resumen.forEach((element) => {
      a_pagar += element.total;
    });
    let saldo = resumen[0].saldo;
    res.render("pendientesCliente", {
      login: true,
      titulo: "Pendientes",
      tipo: user.tipo,
      name: user.nombre,
      codigo,
      resumen,
      a_pagar,
      saldo,
    });
  } else {
    res.redirect("/");
  }
};

const registrarFact = async (req, res) => {
  let user = req.session.user;
  const factura = {
    fecha: req.body.fecha,
    cedula: req.body.ced,
    nombre: req.body.name,
    email: req.body.email,
    telefono: req.body.tel,
    direccion: req.body.direccion,
    subtotal: req.body.subtotal,
    total: req.body.totalf,
    cod_pedido: req.body.cod_pedido,
  };
  // Insertar en la base de datos y mensaje
  let msg = await registrarFactura(factura);

  if (user.tipo == 3) {
    res.render("listaPedidos", {
      login: true,
      alert: true,
      alertTitle: "Factura Guardada",
      alertMessage: msg,
      icon: "success",
      timer: 1500,
      ruta: "listaPedidos",
    });
  } else {
    res.render("tablePendientes", {
      login: true,
      alert: true,
      alertTitle: "Factura Guardada",
      alertMessage: msg,
      icon: "success",
      timer: 1500,
      ruta: "tablePendientes",
    });
  }
};

// Vista de pago para el administrador
const vistaPagoAdministrador = async (req, res) => {
  if (req.session.loggedinAdmin) {
    let user = req.session.user;
    const codigo = req.body.id;
    let actualizar = await updateEstadoConductor(codigo);
    if (user.tipo == 3) {
      let resumen = await buscarPorPedidoSS(codigo);
      let a_pagar = 0;
      resumen.forEach((element) => {
        a_pagar += element.total;
      });
      res.render("listaPedidos", {
        alert: true,
        login: true,
        titulo: "listado",
        timer: 0,
        tipo: user.tipo,
        name: user.nombre,
        codigo,
        resumen,
        a_pagar,
        actualizar,
        ruta: "listaPedidos",
      });
    } else {
      let resumen = await buscarPorPedido(codigo);
      let a_pagar = 0;
      resumen.forEach((element) => {
        a_pagar += element.total;
      });
      let saldo = resumen[0].saldo;
      res.render("pagos", {
        login: true,
        titulo: "Pagar",
        tipo: user.tipo,
        name: user.nombre,
        codigo,
        resumen,
        a_pagar,
        saldo,
      });
    }
  } else {
    res.redirect("/");
  }
};

// Vista pagos para el Repartidor
const vistaPagoRepartidor = async (req, res) => {
  if (req.session.loggedinRepartidor) {
    let user = req.session.user;
    const codigo = req.body.id;
    let actualizar = await updateEstadoConductor(codigo);
    if (user.tipo == 3) {
      let resumen = await buscarPorPedidoSS(codigo);
      let a_pagar = 0;
      resumen.forEach((element) => {
        a_pagar += element.total;
      });
      res.render("pagos", {
        login: true,
        titulo: "Pagos",
        timer: 0,
        tipo: user.tipo,
        name: user.nombre,
        codigo,
        resumen,
        a_pagar,
        actualizar,
      });
    } else {
      let resumen = await buscarPorPedido(codigo);
      let a_pagar = 0;
      resumen.forEach((element) => {
        a_pagar += element.total;
      });
      let saldo = resumen[0].saldo;
      res.render("pagos", {
        login: true,
        titulo: "Pagar",
        tipo: user.tipo,
        name: user.nombre,
        codigo,
        resumen,
        a_pagar,
        saldo,
      });
    }
  } else {
    res.redirect("/");
  }
};

module.exports = {
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
};
