const express = require('express');
const app = express();
const hbs = require("hbs");
const bcryptjs = require("bcryptjs")
const session = require("express-session")
const dotenv = require("dotenv");
const { getUsers, insertUser, deleteUser, editUser, authUser, authEmail } = require("./conexion/consultas")
    // Helpers
require('./hbs/helpers')

// Estaticas
app.use(express.static(__dirname + '/public'));

// Establecer el motor para las vistas
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// Middlewars
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Dotenv
//dotenv.config({ path: './env/.env' });

// express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true

}))

// Rutas de la página web

app.get('/admin', function(req, res) {
    res.render('admin', {
        titulo: 'Admin',
    });
});
app.get('/cliente', function(req, res) {
    res.render('cliente', {
        titulo: 'Admin',
    });
});
app.get('/producto', function(req, res) {
    res.render('producto', {
        titulo: 'Admin',
    });
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
            alertTitle: 'Registro',
            alertMessage: resp,
            icon: 'success',
            timer: 1500,
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
            req.session.loggedin = true;
            req.session.name = authe[0].nombre;
            res.render('login', {
                alert: true,
                alertTitle: "Conexion Exitosa",
                alertMessage: 'Login Correcto',
                icon: 'success',
                timer: 1500,
                ruta: 'admin'
            });
        }
    }
})

app.get('/', function(req, res) {
    if (req.session.loggedin) {
        res.render('admin', {
            login: true,
            name: req.session.name
        });
    } else {
        res.render('login', {
            login: false,

        })
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
})

app.listen(3000, () => {
    console.log("Servidor Iniciado, escuchando el puerto 3000");
});