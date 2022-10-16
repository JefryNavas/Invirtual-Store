const express = require("express");
const app = express();
const hbs = require("hbs");
const session = require("express-session");

// Helpers
require("./src/helpers/helpers");

//Puerto
const port = process.env.PORT || 3000;

// Estaticas
app.use(express.static(__dirname + "/public"));

// Establecer el motor para las vistas
hbs.registerPartials(__dirname + "/src/views/partials");
app.set("view engine", "hbs");
app.set("views", __dirname + "/src/views");

// Middlewars
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Rutas de la página web
const routes = require("./src/routes/routes");
app.use(routes);

app.listen(port, () => {
  console.log("Servidor Iniciado, escuchando el puerto 3000");
});
