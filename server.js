const express = require('express');
const app = express();
const hbs = require("hbs");
const bcryptjs = require("bcryptjs")
const session = require("express-session")
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const mimeTypes = require("mime-types");
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
    insertProduct
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


app.get('/pedido', function(req, res) {
    if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
        let user = req.session.user;
        res.render('pedido', {
            login: true,
            titulo: 'Pedido',
            tipo: user.tipo,
            name: user.nombre
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
        pass: req.body.pass
    };
    // Insertar en la base de datos y mensaje
    //let passhash = await bcryptjs.hash(user.pass, 8);
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

});

// Registrar Producto
app.post('/producto', upload.single('imagen'), async(req, res) => {
    let user = req.session.user;
    const producto = {
        codigo: req.body.codigo,
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
    let msg = await insertProduct(producto.codigo, producto.nombre, producto.proveedor, producto.categoria,
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
                tipo: authe[0].id_tipo
            }
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
    })

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
        if (cliente[0]) {
            res.render('pedido', {
                login: true,
                titulo: 'Pedido',
                tipo: user.tipo,
                name: user.nombre,
                nombre: cliente[0].nombre_cli,
                edad: cliente[0].edad,
                tel: cliente[0].tlf,
                medio: cliente[0].medio_compra,
            });
        } else {
            res.render('pedido', {
                tipo: user.tipo,
                alert: true,
                alertMessage: 'No existe el Usuario buscado',
                icon: 'error',
                timer: 1700,
                ruta: 'pedido'
            });

        }
    }




});


app.listen(port, () => {
    console.log("Servidor Iniciado, escuchando el puerto 3000");
});