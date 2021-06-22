const http = require("http");

http.createServer((req, res) => {
    /* res.write("Hola Mundo :) Ahora en la web desde JS");
    res.end(); */
    res.writeHead(200, { "Content-Type": "application/json" });
    let contenido = {
        personaje: "Iron Man",
        edad: 39,
        url: req.url
    }
    res.write(JSON.stringify(contenido));
    res.end();

}).listen(8080);

console.log("Escuchando el puerto 8080...");