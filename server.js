const express = require('express');
const app = express();
const hbs = require("hbs");
const bcryptjs = require("bcryptjs")
const session = require("express-session")
const dotenv = require("dotenv");
const { getUsers, insertUser, deleteUser, editUser } = require("./conexion/consultas")
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
app.get('/', function(req, res) {
    res.render('login');
});
app.get('/admin', function(req, res) {
    res.render('admin', {
        titulo: 'admin',
    });
});
app.get('/cliente', function(req, res) {
    res.render('cliente', {});
});
app.get('/producto', function(req, res) {
    res.render('producto', {
        titulo: '',
    });
});
app.post('/register', async(req, res) => {
    const user = {
        email: req.body.user,
        name: req.body.name,
        rol: req.body.rol,
        pass: req.body.pass
    };
    insertUser(user.rol, user.name, user.email, user.pass).then(resp => res.render('login', {
        alert: true,
        alertMessage: resp
    }));
});

app.listen(3000, () => {
    console.log("Servidor Iniciado, escuchando el puerto 3000");
});