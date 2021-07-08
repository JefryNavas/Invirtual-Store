const express = require('express');
const app = express();
const hbs = require("hbs");
const bcryptjs = require("bcryptjs")
const session = require("express-session")
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const mimeTypes = require("mime-types");
const date = require('date-and-time');
const {
    getUsers,
    insertUser,
    deleteUser,
    editUser,
    authUser,
    authEmail,
    getProvedores,
    insertProv,
    deleteProv,
    getGeneros,
    insertCliente,
    getClientes,
    buscarPorCed,
    getCategorias,
    insertProduct,
    getProductos,
    productoPorId,
    getProductosTabla,
    hacerPedido,
    getCodPedidos,
    buscarPorPedido,
    insertPago,
    updateEstado,
    insertGanancias,
    getGanancias
} = require("./conexion/consultas")
    // Helpers
require('./hbs/helpers')

const storage = multer.diskStorage({

    destination: 'uploads/',
    filename: function(req, file, cb) {
        cb("", Date.now() + "." + mimeTypes.extension(file.mimetype));
    }
})

const upload = multer({
    storage: storage
});

//Puerto
const port = process.env.PORT || 3000;

// Estaticas
app.use(express.static(__dirname + '/public'));

// Establecer el motor para las vistas
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// Middlewars
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true

}))

// Rutas de la página web
app.get('/', function(req, res) {
    res.render('login', {
        titulo: 'Login',
    });
});

app.get('/admin', function(req, res) {
    if (req.session.loggedinAdmin) {
        let user = req.session.user;
        res.render('admin', {
            login: true,
            titulo: 'Dashboard',
            tipo: 'admin',
            name: user.nombre
        });
    } else {
        res.redirect('/')
    }
});
app.get('/empleado', function(req, res) {
    if (req.session.loggedinEmpleado) {
        let user = req.session.user;
        res.render('empleado', {
            login: true,
            tipo: 'empleado',
            name: user.nombre
        });
    } else {
        res.redirect('/')
    }
});

app.get('/repartidor', function(req, res) {
    if (req.session.loggedinRepartidor) {
        let user = req.session.user;
        res.render('repartidor', {
            login: true,
            tipo: 'repartidor',
            name: user.nombre
        });
    } else {
        res.redirect('/')
    }
});



app.get('/cliente', async(req, res) => {
    if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
        let user = req.session.user;
        let genero = await getGeneros();
        res.render('cliente', {
            login: true,
            titulo: 'Cliente',
            tipo: user.tipo,
            name: user.nombre,
            genero
        });
    } else {
        res.redirect('/')
    }
});
app.get('/producto', async(req, res) => {
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
});


app.get('/pedido', async(req, res) => {
    if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
        let user = req.session.user;
        let prod = await getProductos();
        res.render('pedido', {
            login: true,
            titulo: 'Pedido',
            tipo: user.tipo,
            name: user.nombre,
            prod,
            productos: req.session.productos,
            cliente: req.session.cliente,
            nuevoP: req.session.nuevoPro
        });
    } else {
        res.redirect('/')
    }
});

app.get('/proveedor', function(req, res) {
    if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
        let user = req.session.user;
        res.render('proveedor', {
            login: true,
            titulo: 'Nuevo Proveedor',
            tipo: user.tipo,
            name: user.nombre
        });
    } else {
        res.redirect('/')
    }
});



// Registrar Usuario
app.post('/register', async(req, res) => {
    const user = {
        email: req.body.user,
        name: req.body.name,
        rol: req.body.rol,
        pass: req.body.pass,
        pass2: req.body.pass2
    };
    // Insertar en la base de datos y mensaje
    //let passhash = await bcryptjs.hash(user.pass, 8);
    if (user.pass2 == user.pass) {
        if (await authEmail(user.email)) {
            insertUser(user.rol, user.name, user.email, user.pass).then(resp => res.render('login', {
                alert: true,
                alertTitle: 'Registrado Correctamente',
                alertMessage: resp,
                icon: 'success',
                timer: 1700,
                ruta: ''
            }));
        } else {
            res.render('login', {
                alert: true,
                alertMessage: 'El email ya existe',
                icon: 'error',
                timer: 1500,
                ruta: ''
            });
        }

    } else {
        res.render('login', {
            alert: true,
            alertMessage: 'Las Contraseñas no coinciden',
            icon: 'error',
            timer: 1500,
            ruta: ''
        });

    }



});

// Registrar Producto
app.post('/producto', upload.single('imagen'), async(req, res) => {
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

});



// Autenticar Usuario
app.post('/auth', async(req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    //let passhash = await bcryptjs.hash(pass, 8);

    if (user && pass) {
        const authe = await authUser(user, pass);
        if (authe == false) {
            res.render('login', {
                alert: true,
                alertTitle: "Error",
                alertMessage: 'Usuario y/o Contraseña incorrectas',
                icon: 'error',
                showConfirmButton: true,
                ruta: ''

            });
        } else {
            let Ruta;
            if (authe[0].id_tipo == "2") {
                req.session.loggedinEmpleado = true;
                Ruta = 'empleado';
            } else if (authe[0].id_tipo == "3") {
                req.session.loggedinRepartidor = true;
                Ruta = 'repartidor';
            } else if (authe[0].id_tipo == "1") {
                req.session.loggedinAdmin = true;
                Ruta = 'admin';
            }
            req.session.user = {
                nombre: authe[0].nombre,
                email: authe[0].email,
                tipo: authe[0].id_tipo,
                id: authe[0].id_empleado
            }
            req.session.productos = [];
            req.session.cliente;
            req.session.cod_pedido;
            req.session.nuevoPro;
            res.render('login', {
                alert: true,
                alertTitle: "Conexion Exitosa",
                alertMessage: 'Login Correcto',
                icon: 'success',
                timer: 1500,
                ruta: Ruta
            });
        }
    }
});

// Logout del usuario
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
})

app.get('/repartidor', function(req, res) {
    if (req.session.loggedinRepartidor) {
        let user = req.session.user;
        res.render('repartidor', {
            login: true,
            tipo: 'repartidor',
            name: user.nombre
        });
    } else {
        res.redirect('/')
    }
});

// Tabla Usuarios 
app.get('/tableUser', async(req, res) => {
    if (req.session.loggedinAdmin) {

        let user = req.session.user;
        let users = await getUsers();
        res.render('tableUser', {
            login: true,
            titulo: 'Tablas',
            tipo: user.tipo,
            name: user.nombre,
            users
        });
    } else {
        res.redirect('/')
    }
});

// Editar Usuario
app.post('/tableUser', async(req, res) => {
    if (req.session.loggedinAdmin) {
        let user = req.session.user;
        const idUser = req.body.id;
        let users = await getUsers();
        let usuario = users.find(obj => obj.id_empleado == idUser);
        res.render('tableUser', {
            login: true,
            titulo: 'Tablas',
            tipo: user.tipo,
            name: user.nombre,
            usuario
        });
    } else {
        res.redirect('/')
    }
});
app.post('/editUser', async(req, res) => {
    let userr = req.session.user;
    const user = {
        id: req.body.id_empleado,
        email: req.body.user,
        name: req.body.name,
        rol: req.body.rol,
        pass: req.body.pass
    };

    const msg = await editUser(user.id, user.name, user.rol, user.email, user.pass);

    res.render('tableUser', {
        tipo: userr.tipo,
        alert: true,
        alertTitle: msg,
        icon: 'success',
        timer: 1700,
        ruta: 'tableUser'
    });

})

// Tabla Proveedor
app.get('/tableProvee', async(req, res) => {
    if (req.session.loggedinAdmin) {
        let user = req.session.user;
        let prov = await getProvedores();

        res.render('tableProvee', {
            login: true,
            titulo: 'Tablas',
            tipo: user.tipo,
            name: user.nombre,
            prov
        });
    } else {
        res.redirect('/')
    }
});

// Tabla Clientes
app.get('/tableClientes', async(req, res) => {
    if (req.session.loggedinAdmin) {
        let user = req.session.user;
        let client = await getClientes();

        res.render('tableClientes', {
            login: true,
            titulo: 'Tablas',
            tipo: user.tipo,
            name: user.nombre,
            client
        });
    } else {
        res.redirect('/')
    }
});


// Tabla Productos
app.get('/tableProductos', async(req, res) => {
    if (req.session.loggedinAdmin) {
        let user = req.session.user;
        let product = await getProductosTabla();

        res.render('tableProductos', {
            login: true,
            titulo: 'Tablas',
            tipo: user.tipo,
            name: user.nombre,
            product
        });
    } else {
        res.redirect('/')
    }
});


//Eliminar Usuario
app.get('/deleteUser/:id', async(req, res) => {
    if (req.session.loggedinAdmin) {
        let user = req.session.user;
        const idUser = req.params.id;
        let msg = await deleteUser(idUser);
        res.render('tableUser', {
            login: true,
            titulo: 'Tables',
            tipo: user.tipo,
            name: user.nombre,
            alert: true,
            alertTitle: msg,
            icon: 'success',
            timer: 1500,
            ruta: 'tableUser'
        });
    } else {
        res.redirect('/')
    }
});
//Eliminar Proveedor
app.get('/deleteProv/:id', async(req, res) => {
    if (req.session.loggedinAdmin) {
        let user = req.session.user;
        const idprov = req.params.id;
        let msg = await deleteProv(idprov);
        res.render('tableProvee', {
            login: true,
            titulo: 'Tables',
            tipo: user.tipo,
            name: user.nombre,
            alert: true,
            alertTitle: msg,
            icon: 'success',
            timer: 1500,
            ruta: 'tableProvee'
        });
    } else {
        res.redirect('/')
    }
});

// Registrar Proveedor
app.post('/regprov', async(req, res) => {
    let user = req.session.user;
    const prove = {
        name: req.body.name,
    };
    // Insertar en la base de datos y mensaje
    await insertProv(prove.name).then(resp => res.render('proveedor', {
        tipo: user.tipo,
        alert: true,
        alertTitle: 'Registrado Correctamente',
        alertMessage: resp,
        icon: 'success',
        timer: 1500,
        ruta: 'proveedor'
    }));

});

// Registrar Cliente
app.post('/regcli', async(req, res) => {
    let user = req.session.user;
    const cli = {
        cedula: req.body.ced,
        name: req.body.name,
        email: req.body.email,
        edad: req.body.edad,
        gen: req.body.genero,
        tel: req.body.tel,
        medio: req.body.medio
    };
    // Insertar en la base de datos y mensaje
    await insertCliente(cli.cedula, cli.name, cli.email, cli.edad, cli.gen, cli.tel, cli.medio).then(resp => res.render('cliente', {
        tipo: user.tipo,
        alert: true,
        alertTitle: 'Registrado Correctamente',
        alertMessage: resp,
        icon: 'success',
        timer: 1500,
        ruta: 'cliente'
    }));

});

// Buscar CLiente
app.post('/buscarcli', async(req, res) => {
    if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
        let user = req.session.user;
        let cedula = req.body.cedula;
        let cliente = await buscarPorCed(cedula);
        let prod = await getProductos();
        if (cliente[0]) {
            req.session.cliente = cliente[0];
            res.render('pedido', {
                login: true,
                titulo: 'Pedido',
                tipo: user.tipo,
                name: user.nombre,
                cliente: req.session.cliente,
                prod,
                nuevoP: req.session.nuevoPro,
            });
        } else {
            req.session.nuevoPro = false;
            res.render('pedido', {
                tipo: user.tipo,
                alert: true,
                alertMessage: 'No existe el Usuario buscado',
                icon: 'error',
                timer: 1700,
                ruta: 'pedido',
                nuevoP: req.session.nuevoPro,

            });

        }
    }

});


app.post('/addprod', async(req, res) => {
    if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
        let user = req.session.user;
        let idprod = req.body.producto;
        let cant = req.body.cantidad;
        let producto = await productoPorId(idprod);
        let total = cant * producto[0].precio_mercado
        let prod = await getProductos();


        if (cant <= producto[0].stock) {

            product = {
                cod_pedido: `pedido-${req.session.cod_pedido}`,
                id_cliente: req.session.cliente.cedula_cli,
                codigoProd: producto[0].cod_prod,
                nombreProd: producto[0].nombre_prod,
                cant: parseInt(cant, 10),
                total,
                subtotal: total,
                estado: "No entregado",
                /* fechaEntrega: "",
                calleP: "",
                calleS: "" */
            }
            req.session.productos.push(product);
            res.render('pedido', {
                login: true,
                titulo: 'Pedido',
                tipo: user.tipo,
                name: user.nombre,
                productos: req.session.productos,
                cliente: req.session.cliente,
                prod,
                nuevoP: req.session.nuevoPro,
            });
        } else {
            req.session.nuevoPro = true;
            res.render('pedido', {
                tipo: user.tipo,
                alert: true,
                alertMessage: 'No existe stock suficiente para el producto requerido',
                icon: 'error',
                timer: 1700,
                ruta: 'pedido',
                nuevoP: req.session.nuevoPro,
            });

        }
    }

});
app.post('/nuevoPedido', async(req, res) => {
    if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
        let user = req.session.user;
        let nuevo = req.body.nuevo;
        req.session.productos = [];
        req.session.cliente;
        req.session.cod_pedido = Date.now();
        req.session.nuevoPro = true;
        if (nuevo == "nuevo") {
            res.render('pedido', {
                login: true,
                titulo: 'Pedido',
                tipo: user.tipo,
                name: user.nombre,
                nuevoP: req.session.nuevoPro,
                productos: req.session.productos,
                cliente: null
            });
        }

    }
});
app.post('/hacerPedido', async(req, res) => {
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
        //console.log(req.session.productos);
        let msg = await hacerPedido(req.session.productos);
        req.session.nuevoPro = false;
        res.render('pedido', {
            login: true,
            titulo: 'Pedido',
            name: user.nombre,
            tipo: user.tipo,
            alert: true,
            alertMessage: msg,
            icon: 'success',
            timer: 1700,
            ruta: 'pedido',
            nuevoP: req.session.nuevoPro

        });
    }
});

app.get('/pagos', function(req, res) {
    if (req.session.loggedinRepartidor) {
        let user = req.session.user;
        res.render('pagos', {
            login: true,
            titulo: 'Pagos',
            tipo: user.tipo,
            name: user.nombre
        });
    } else {
        res.redirect('/')
    }
});

app.get('/factura', function(req, res) {
    if (req.session.loggedinRepartidor) {
        let user = req.session.user;
        res.render('factura', {
            login: true,
            titulo: 'factura',
            tipo: user.tipo,
            name: user.nombre
        });
    } else {
        res.redirect('/')
    }
});


app.get('/listaPedidos', async(req, res) => {
    if (req.session.loggedinRepartidor) {
        let user = req.session.user;
        let codped = await getCodPedidos();

        res.render('listaPedidos', {
            login: true,
            titulo: 'Pedidos',
            tipo: user.tipo,
            name: user.nombre,
            codped
        });
    } else {
        res.redirect('/')
    }
});

// Listar Pedidos Individualmente
app.post('/listaPedidos', async(req, res) => {
    if (req.session.loggedinRepartidor) {
        let user = req.session.user;
        const codigo = req.body.id;
        let codped = await getCodPedidos();
        let resumen = await buscarPorPedido(codigo);
        let a_pagar = 0
        resumen.forEach(element => {
            a_pagar += element.total
        });
        res.render('listaPedidos', {
            login: true,
            titulo: 'Pedido',
            tipo: user.tipo,
            name: user.nombre,
            codigo,
            resumen,
            cli: resumen[0].nombre_cli,
            tel: resumen[0].tlf,
            a_pagar
        });
    } else {
        res.redirect('/')
    }
});


app.post('/pagos', async(req, res) => {
    if (req.session.loggedinRepartidor) {
        let user = req.session.user;
        const codigo = req.body.id;
        let resumen = await buscarPorPedido(codigo);
        let a_pagar = 0
        resumen.forEach(element => {
            a_pagar += element.total
        });
        res.render('pagos', {
            login: true,
            titulo: 'Pagar',
            tipo: user.tipo,
            name: user.nombre,
            codigo,
            resumen,
            a_pagar
        });
    } else {
        res.redirect('/')
    }
});


// Registrar Pagos
app.post('/regpago', async(req, res) => {
    let user = req.session.user;
    const now = new Date();
    let fecha = date.format(now, 'ddd, MMM DD YYYY');
    let total = req.body.total
    let saldo = total - req.body.monto
    let idUser = user.id;
    let codigo = req.body.codigop
    let resumen = await buscarPorPedido(codigo);
    let rp = ""
    let estado = ""
    if (saldo > 1) {
        rp = `Cuota Registrada, Saldo Pendiente de: $${saldo} `
        estado = "Pago Parcial"
    } else {
        rp = "Pago Registrado"
        estado = "Cancelado"
    }
    let win = 0
    if (total >= 60) {
        win = 5;
    } else {
        win = 3;
    }


    const cli = {
        fecha,
        monto: req.body.monto,
        saldo,
        tipo: req.body.tipo,
        forma: req.body.forma,
        idUser,
        codigo,
        cedula: resumen[0].cedula_cli,
        win
    };
    let actualizar = await updateEstado(codigo, estado);
    let ganancias = await insertGanancias(cli.idUser, cli.codigo, cli.fecha, cli.win)
        // Insertar en la base de datos y mensaje
    await insertPago(cli.fecha, cli.cedula, cli.monto, cli.saldo, cli.tipo, cli.forma, cli.idUser, cli.codigo).then(resp => res.render('listaPedidos', {
        login: true,
        tipo: user.tipo,
        name: user.nombre,
        alert: true,
        alertTitle: rp,
        alertMessage: actualizar,
        icon: 'success',
        timer: 2500,
        ruta: 'listaPedidos',
        actualizar,
        ganancias
    }));

});

// Tabla Ganancias Repartidor 
app.get('/tableGanancias', async(req, res) => {
    if (req.session.loggedinRepartidor) {
        let user = req.session.user;
        let codigo = user.id
        let ganancias = await getGanancias(codigo);
        suma = 0
        ganancias.forEach(element => {
            suma += element.ganancia
        });
        res.render('tableGanancias', {
            login: true,
            titulo: 'Tus Ganancias',
            tipo: user.tipo,
            name: user.nombre,
            ganancias,
            suma
        });
    } else {
        res.redirect('/')
    }
});


app.get('/tablePedidos', async(req, res) => {
    if (req.session.loggedinAdmin) {
        let user = req.session.user;
        let codped = await getCodPedidos();

        res.render('tablePedidos', {
            login: true,
            titulo: 'Pedidos',
            tipo: user.tipo,
            name: user.nombre,
            codped
        });
    } else {
        res.redirect('/')
    }
});

// Listar Pedidos Individualmente
app.post('/tablePedidos', async(req, res) => {
    if (req.session.loggedinAdmin) {
        let user = req.session.user;
        const codigo = req.body.id;
        let codped = await getCodPedidos();
        let resumen = await buscarPorPedido(codigo);
        let a_pagar = 0
        resumen.forEach(element => {
            a_pagar += element.total
        });
        res.render('tablePedidos', {
            login: true,
            titulo: 'Pedido',
            tipo: user.tipo,
            name: user.nombre,
            codigo,
            resumen,
            cli: resumen[0].nombre_cli,
            tel: resumen[0].tlf,
            a_pagar
        });
    } else {
        res.redirect('/')
    }
});


app.get('/tablePendientes', async(req, res) => {
    if (req.session.loggedinAdmin) {
        let user = req.session.user;
        let codped = await getCodPedidos();

        res.render('tablePendientes', {
            login: true,
            titulo: 'Pendientes',
            tipo: user.tipo,
            name: user.nombre,
            codped
        });
    } else {
        res.redirect('/')
    }
});

// Listar Pedidos Individualmente
app.post('/tablePendientes', async(req, res) => {
    if (req.session.loggedinAdmin) {
        let user = req.session.user;
        const codigo = req.body.id;
        let codped = await getCodPedidos();
        let resumen = await buscarPorPedido(codigo);
        let a_pagar = 0
        resumen.forEach(element => {
            a_pagar += element.total
        });
        res.render('tablePendientes', {
            login: true,
            titulo: 'Pendientes',
            tipo: user.tipo,
            name: user.nombre,
            codigo,
            resumen,
            cli: resumen[0].nombre_cli,
            tel: resumen[0].tlf,
            a_pagar
        });
    } else {
        res.redirect('/')
    }
});



app.listen(port, () => {
    console.log("Servidor Iniciado, escuchando el puerto 3000");
});