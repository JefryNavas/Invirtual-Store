const express = require('express');
const app = express();
const hbs = require("hbs");
require('./hbs/helpers')

app.use(express.static(__dirname + '/public'));

// Establecer el motor para las vistas
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');


app.get('/', function(req, res) {

    res.render('login', {
        titulo: 'Home',
        nombre: 'juAn PereZ',
    });
});
app.get('/admin', function(req, res) {

    res.render('admin', {
        titulo: 'admin',
    });
});
app.get('/cliente', function(req, res) {

    res.render('cliente', {

    });
});

app.get('/producto', function(req, res) {

    res.render('producto', {
        titulo: '',
    });
});


/* app.get('/data', (req, res) => {
    res.send('data');
}); */
app.listen(3000, () => {
    console.log("Servidor Iniciado, escuchando el puerto 3000");
});