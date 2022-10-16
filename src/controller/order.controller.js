const moment = require("moment");
const { getProductos, productoPorId } = require("../services/productService");
const {
  hacerPedido,
  getCodPedidosSS,
  pedidosPorCliente,
  getAsigandos,
  getCodPedidos,
  buscarPorPedido,
  buscarPorPedidoSS,
  getEstadoPed,
  updateEstadoConductor,
  getCodPedidosSSRepartidor,
  getNoEntregados,
} = require("../services/orderService");

const { getCluster, shuffle } = require("../helpers/cluster");

const {
  getAllRepartidores,
  updateConductor,
  getDatosConductor,
} = require("../services/employeeService");

const pedido = async (req, res) => {
  if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
    let user = req.session.user;
    res.render("pedido", {
      login: true,
      titulo: "Pedido",
      tipo: user.tipo,
      name: user.nombre,
      prod: req.session.prod,
      productos: req.session.productos,
      cliente: req.session.cliente,
      nuevoP: req.session.nuevoPro,
    });
  } else {
    res.redirect("/");
  }
};

const nuevoPedido = async (req, res) => {
  if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
    let user = req.session.user;
    let nuevo = req.body.nuevo;
    req.session.productos = [];
    req.session.cliente;
    req.session.cod_pedido = Date.now();
    req.session.nuevoPro = true;
    req.session.prod = await getProductos();
    for (const i in req.session.prod) {
      req.session.prod[i].visible = true;
    }
    if (nuevo == "nuevo") {
      res.render("pedido", {
        login: true,
        titulo: "Pedido",
        tipo: user.tipo,
        name: user.nombre,
        nuevoP: req.session.nuevoPro,
        productos: req.session.productos,
        prod: req.session.prod,
        cliente: null,
      });
    }
  }
};

//Añadir Producto
const addProducto = async (req, res) => {
  if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
    let user = req.session.user;
    let idprod = req.body.producto;
    let cant = parseInt(req.body.cantidad, 10);
    let producto = await productoPorId(idprod);
    let total = cant * producto[0].precio_mercado;

    if (cant <= producto[0].stock) {
      let stock = producto[0].stock - cant;
      product = {
        cod_pedido: `pedido-${req.session.cod_pedido}`,
        id_cliente: req.session.cliente.cedula_cli,
        codigoProd: producto[0].cod_prod,
        nombreProd: producto[0].nombre_prod,
        cant: parseInt(cant, 10),
        total,
        subtotal: total,
        estado: "Pedido Registrado",
        stock,
      };
      req.session.productos.push(product);
      for (const i in req.session.prod) {
        for (const k in req.session.productos) {
          if (
            req.session.prod[i].cod_prod == req.session.productos[k].codigoProd
          ) {
            req.session.prod[i].visible = false;
          }
        }
      }

      res.render("pedido", {
        login: true,
        titulo: "Pedido",
        tipo: user.tipo,
        name: user.nombre,
        productos: req.session.productos,
        cliente: req.session.cliente,
        prod: req.session.prod,
        nuevoP: req.session.nuevoPro,
      });
    } else {
      req.session.nuevoPro = true;
      res.render("pedido", {
        productos: req.session.productos,
        prod: req.session.prod,
        cliente: req.session.cliente,
        nuevoP: req.session.nuevoPro,
        tipo: user.tipo,
        alert: true,
        alertMessage: "No existe stock suficiente para el producto requerido",
        icon: "error",
        timer: 1700,
        ruta: "pedido",
      });
    }
  }
};

const quitarProducto = async (req, res) => {
  if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
    let user = req.session.user;
    let cod_prod = req.body.quitar;

    for (const i in req.session.prod) {
      if (req.session.prod[i].cod_prod == cod_prod) {
        req.session.prod[i].visible = true;
      }
    }
    for (const i in req.session.productos) {
      if (req.session.productos[i].codigoProd == cod_prod) {
        req.session.productos.splice(i, 1);
      }
    }
    res.render("pedido", {
      login: true,
      titulo: "Pedido",
      tipo: user.tipo,
      name: user.nombre,
      nuevoP: req.session.nuevoPro,
      productos: req.session.productos,
      prod: req.session.prod,
      cliente: req.session.cliente,
    });
  }
};

const hacerPedidoView = async (req, res) => {
  if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
    let user = req.session.user;
    let fecha = req.body.fecha;
    let principal = req.body.principal;
    let secundaria = req.body.secundaria;
    for (const i in req.session.productos) {
      req.session.productos[i].fecha = fecha;
      req.session.productos[i].principal = principal;
      req.session.productos[i].secundaria = secundaria;
    }
    let msg = await hacerPedido(req.session.productos);

    req.session.nuevoPro = false;
    res.render("pedido", {
      login: true,
      titulo: "Pedido",
      name: user.nombre,
      tipo: user.tipo,
      alert: true,
      alertMessage: msg,
      icon: "success",
      timer: 1700,
      ruta: "pedido",
      nuevoP: req.session.nuevoPro,
    });
  }
};

const tusPedidosCliente = async (req, res) => {
  if (req.session.loggedinCliente) {
    let user = req.session.user;
    let cedula = user.id;
    let pedidos = await pedidosPorCliente(cedula);
    res.render("tusPedidos", {
      login: true,
      titulo: "Pedidos",
      tipo: "cliente",
      name: user.nombre,
      pedidos,
    });
  } else {
    res.redirect("/");
  }
};

// Resumen pedido del cliente
const tusPedidosResumen = async (req, res) => {
  if (req.session.loggedinCliente) {
    let user = req.session.user;
    let codigo = req.body.id;
    let resumen = await buscarPorPedidoSS(codigo);
    let a_pagar = 0;
    resumen.forEach((element) => {
      a_pagar += element.total;
    });
    res.render("tusPedidos", {
      login: true,
      titulo: "Pedidos",
      tipo: "cliente",
      name: user.nombre,
      resumen,
      a_pagar,
    });
  } else {
    res.redirect("/");
  }
};

const asignadosTodos = async (req, res) => {
  if (req.session.loggedinAdmin) {
    let user = req.session.user;
    let codped = await getAsigandos();

    res.render("tableAsignados", {
      login: true,
      titulo: "Asignados",
      tipo: user.tipo,
      name: user.nombre,
      codped,
    });
  } else {
    res.redirect("/");
  }
};

// Resumen del pedido
const asignadosResumen = async (req, res) => {
  if (req.session.loggedinAdmin) {
    let user = req.session.user;
    const codigo = req.body.id;
    let resumen = await buscarPorPedidoSS(codigo);
    let a_pagar = 0;
    resumen.forEach((element) => {
      a_pagar += element.total;
    });
    let saldo = resumen[0].saldo;
    res.render("tableAsignados", {
      login: true,
      titulo: "Asignados",
      tipo: user.tipo,
      name: user.nombre,
      codigo,
      resumen,
      cli: resumen[0].nombre_cli,
      tel: resumen[0].tlf,
      a_pagar,
      saldo,
    });
  } else {
    res.redirect("/");
  }
};

const repartirPedidos = async (req, res) => {
  if (req.session.loggedinAdmin) {
    let user = req.session.user;
    const cluster = req.body.repartidores;
    let data = await getCluster(cluster);
    if (data.Repartidores.estado) {
      let repartidores = await getAllRepartidores();
      let id_empleados = [];
      for (const i in repartidores) {
        id_empleados.push(repartidores[i].id_empleado);
      }
      //Aleatorizar el vector
      shuffle(id_empleados);

      let datos = data.Repartidores.data;
      for (const i in id_empleados) {
        for (const k in datos) {
          if (datos[k].Repartidor == i) {
            datos[k].Repartidor = id_empleados[i];
          }
        }
      }
      if (datos) {
        if (await updateConductor(datos)) {
          res.render("tableNoEntregados", {
            loading: true,
            login: true,
            name: user.nombre,
            tipo: user.tipo,
            alert: true,
            alertTitle: "Repartidores Asignados Correctamente",
            icon: "success",
            timer: 1500,
            ruta: "tableNoEntregados",
          });
        }
      }
    } else {
      res.render("tableNoEntregados", {
        loading: true,
        login: true,
        name: user.nombre,
        tipo: user.tipo,
        alert: true,
        alertTitle: data.Repartidores.message,
        icon: "error",
        timer: 1500,
        ruta: "tableNoEntregados",
      });
    }
  }
};

// Seguimiento del pedido
const seguimientoPedido = async (req, res) => {
  if (req.session.loggedinCliente) {
    let user = req.session.user;
    const codigo = req.body.id;
    let resumen = await buscarPorPedidoSS(codigo);
    let cond = resumen[0].conductor;
    let datoscond = await getDatosConductor(cond);
    let a_pagar = 0;
    resumen.forEach((element) => {
      a_pagar += element.total;
    });
    console.log(cond);
    res.render("seguimiento", {
      login: true,
      titulo: "Seguimiento",
      tipo: user.tipo,
      name: user.nombre,
      codigo,
      fecha: resumen[0].fecha_entrega,
      estado: resumen[0].estado,
      ncond: datoscond[0].nombre,
      placa: datoscond[0].placa,
      a_pagar,
    });
  } else {
    res.redirect("/");
  }
};

// Tabla de pedidos no entregados
const tablaPedidosNoEntregados = async (req, res) => {
  if (req.session.loggedinAdmin) {
    let user = req.session.user;
    let codped = await getNoEntregados();
    let Repartidores = await getAllRepartidores();
    var localTime = moment().format("YYYY-MM-DD");
    let pedidosHoy = [];
    let pedidosDemas = [];
    codped.forEach((element) => {
      if (element.fecha_entrega == localTime) {
        pedidosHoy.push(element);
      } else {
        pedidosDemas.push(element);
      }
    });
    let repartidores = Repartidores.length;
    res.render("tableNoEntregados", {
      login: true,
      titulo: "Por Entregar",
      tipo: user.tipo,
      name: user.nombre,
      codped,
      pedidosHoy,
      pedidosDemas,
      repartidores,
      localTime,
      loading: false,
    });
  } else {
    res.redirect("/");
  }
};

// Resumen del pedido no entregado
const pedidoNoEntregadoResumen = async (req, res) => {
  if (req.session.loggedinAdmin) {
    let user = req.session.user;
    const codigo = req.body.id;
    let resumen = await buscarPorPedidoSS(codigo);
    let a_pagar = 0;
    resumen.forEach((element) => {
      a_pagar += element.total;
    });
    res.render("tableNoEntregados", {
      login: true,
      titulo: "Por Entregar",
      tipo: user.tipo,
      name: user.nombre,
      codigo,
      resumen,
      cli: resumen[0].nombre_cli,
      tel: resumen[0].tlf,
      a_pagar,
    });
  } else {
    res.redirect("/");
  }
};

// Tabla de pedidos pendientes de pago
const tablaPedidosPendientesPago = async (req, res) => {
  if (req.session.loggedinAdmin) {
    let user = req.session.user;
    let codped = await getCodPedidos();

    res.render("tablePendientes", {
      login: true,
      titulo: "Pendientes",
      tipo: user.tipo,
      name: user.nombre,
      codped,
    });
  } else {
    res.redirect("/");
  }
};

// Resumen del pedido pendiente de pago
const pedidoPendientePagoResumen = async (req, res) => {
  if (req.session.loggedinAdmin) {
    let user = req.session.user;
    const codigo = req.body.id;
    let resumen = await buscarPorPedido(codigo);
    let a_pagar = 0;
    resumen.forEach((element) => {
      a_pagar += element.total;
    });
    let saldo = resumen[0].saldo;
    res.render("tablePendientes", {
      login: true,
      titulo: "Pendientes",
      tipo: user.tipo,
      name: user.nombre,
      codigo,
      resumen,
      cli: resumen[0].nombre_cli,
      tel: resumen[0].tlf,
      a_pagar,
      saldo,
    });
  } else {
    res.redirect("/");
  }
};

const tablaPedidos = async (req, res) => {
  if (req.session.loggedinAdmin) {
    let user = req.session.user;
    let codped = await getCodPedidosSS();

    res.render("tablePedidos", {
      login: true,
      titulo: "Pedidos",
      tipo: user.tipo,
      name: user.nombre,
      codped,
    });
  } else {
    res.redirect("/");
  }
};

// Pedidos Resumen
const pedidosResumen = async (req, res) => {
  if (req.session.loggedinAdmin) {
    let user = req.session.user;
    const codigo = req.body.id;
    let estado = await getEstadoPed(codigo);
    let resumen = "";
    let re1 = await getCodPedidos();
    let re2 = await getCodPedidosSS();
    let r1 = await buscarPorPedidoSS(codigo);
    let r2 = await buscarPorPedido(codigo);
    if (
      estado[0].estado != "Entregado-Pago Parcial" ||
      estado[0].estado != "Entregado-Cancelado"
    ) {
      codped = re2;
      resumen = r1;
    } else {
      codped = re1;
      resumen = r2;
    }
    let a_pagar = 0;
    resumen.forEach((element) => {
      a_pagar += element.total;
    });
    res.render("tablePedidos", {
      login: true,
      titulo: "Pedido",
      tipo: user.tipo,
      name: user.nombre,
      codigo,
      resumen,
      cli: resumen[0].nombre_cli,
      tel: resumen[0].tlf,
      a_pagar,
    });
  } else {
    res.redirect("/");
  }
};

// Tabla de pedidos del repartidor
const tablaPedidosRepartidor = async (req, res) => {
  if (req.session.loggedinRepartidor) {
    let user = req.session.user;
    let id = user.id;
    let codped = await getCodPedidosSSRepartidor(id);
    res.render("listaPedidos", {
      login: true,
      titulo: "Pedidos",
      tipo: user.tipo,
      name: user.nombre,
      id,
      codped,
    });
  } else {
    res.redirect("/");
  }
};

// Resumen del Pedido del repartidor
const pedidoRepartidorResumen = async (req, res) => {
  if (req.session.loggedinRepartidor) {
    let user = req.session.user;
    const codigo = req.body.id;
    let resumen = await buscarPorPedidoSS(codigo);
    let a_pagar = 0;
    resumen.forEach((element) => {
      a_pagar += element.total;
    });
    res.render("listaPedidos", {
      login: true,
      titulo: "Pedido",
      tipo: user.tipo,
      name: user.nombre,
      codigo,
      resumen,
      cli: resumen[0].nombre_cli,
      tel: resumen[0].tlf,
      estado: resumen[0].estado,
      a_pagar,
    });
  } else {
    res.redirect("/");
  }
};

module.exports = {
  pedido,
  nuevoPedido,
  quitarProducto,
  addProducto,
  hacerPedidoView,
  tablaPedidos,
  pedidosResumen,
  tusPedidosCliente,
  asignadosTodos,
  asignadosResumen,
  repartirPedidos,
  seguimientoPedido,
  tusPedidosResumen,
  tablaPedidosNoEntregados,
  pedidoNoEntregadoResumen,
  tablaPedidosPendientesPago,
  pedidoPendientePagoResumen,
  tablaPedidosRepartidor,
  pedidoRepartidorResumen,
};
