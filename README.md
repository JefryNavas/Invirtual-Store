# Proyecto_Integrador_P58 - Administración de Usuario en Invirtual Store 

Una aplicación que funcionará como un sistema todo en uno, enfocado en la administración del negocio, para solverntar los problemas de venta y registro de inventario que presentan. Se implementará una aplicación web que tendrá su página principal y será de acceso tanto para el administrador, empleados repartidores, y clientes. El administrador podrá gestionar y tener una visión del invetario que tiene, para poder publicarlo o sacarlo de sus publicaciones en redes sociales, podrá ver los pagos pendientes de los clientes y tendrá un registro de las reparticiones hechas por los empleados.  El cliente podrá revisar sus pagos pendientes e información de su pedido en proceso de entrega. Y los repartidores podrán registrar a los clientes, los pagos realizados y así registrar las reparticiones que realizan. 


### Pre-requisitos 📋

Para la realización y prueba del código mostrado en el repositorio se utilizó:
<ul>
  <li>Visual Studio Code</li>
  <li>Node JS  v14.16.0.</li>
  <li>NPM (Node Package Manager)</li>
  <li>Flask</li>
</ul>
Si desea editar, modificar y ejecutar el código del repositorio necesitará disponer de las herramientas listadas. <br/>

### Instalación 🔧

<h4>Instalación del IDE Visual Studio Code</h4>
<p>Para trabajar con Javascript y Node es necesario ya instalación de un etorno de programación y ejecución <br/>
Si ya lo tienes instaldo pasa al siguiente punto.</p>
<ol>
<li>Se descarga  la última versión de Visual Studio Code, dependiendo de su S.O desde la  página oficial de <a href="https://code.visualstudio.com/Download">Visual Studio</a>. </li>
<li>Ejecutar el archivo descargado, y esperar a que culmine su instalación.</li>
<li>Con el Visual Studio Code instalado y ejecutado, se procede a instalar ciertos plugins necesarios para su buen funcionamiento, y ayuda a la hora de programar</li>
<ul>
<li>HTML CSS Support: Sirve para lograr autocompletar HTML como CSS para lograr un diseño más rápido de la página web. </li>
<li>VS Code JavaScript (ES6) snippets: Para lograr una construcción más rápida de código un poco más avanzado de JS, tales como funciones, objetos, constructores, entre otros. </li>
<li>VS Code JS, CSS, HTML Formatting: Brinda atajos de teclado para varias acciones dentro del IDE, además de que agrega una librería que muestra con colores según el uso o la funcionalidad del código para que se vea una forma más bonita y entendible</li>
<li>Terminal for Visual Studio Code: Se agrega un terminal dentro del mismo Visual Studio Code, que permite abrir ciertos archivos en el terminal, además de generar código directamente en el terminal</li>
<li>TypeScript Importer: Se da un autocompletado o atajos para ciertas funciones de Typescript. </li>
</ul>
<li>Finalmente se está listo para poder trabajar.</li>
</ol>

<br/>
<h4>Instalación de Node Js</h4>
<ol>
<li>-	Se descarga la versión LTS de la página oficial que reconocerá automáticamente el S.O en el que se esté trabajando:  <a href="https://nodejs.org/es/"> Descargar Node </a>
<li>Se aceptan los términos de la licencia y se procede a la instalación.</li>
<li>Una vez instalado para commprobar la correcta instalación se puede crear un pequeño programa en Visual Studio Code con extensión .js y se lo ejecuta en la terminal con el formato: <b>node server.js<b> </li>
  </ol> 
  
<br/>
<h4>Instalación de Node Package Manager NPM</h4>
<ol>
  <li>Para instalar npm hay que escribir en el terminal del Sistema Operativo o del propio Visual estudio:  «npm install npm@latest -g» y pulsar Intro</li>
  <li>Teniendo instalado NPM se coloca en el terminal: «npm init», aquí dentro de nuestro proyecto aparecerá un archivo muy importante llamando package.json, mismo que muestra nombre, versión, descripción, autor, el archivo main, y finalmente muestra las dependencias del proyecto, es decir todos los paquetes o módulos que se hayan instalando para el proyecto en cuestión. </li>
  </ol>
  
  <br/>
<h4>Instalación de Entorno de Flask (Python)</h4>
<ol>
  <li>Para instalar flask que es un entorno dentro del lenguaje de Python, para lo cual se necesita contar con cualquier IDE que cuente con el lenguaje Python como <b>Pycharm</b> o <b>Visual Studio Code</b>  </li>
  <li>Para instalar Flask vamos a utilizar pip. Así que simplemente deberemos de escribir en nuestra línea de comandos lo siguiente: </li>
</ol>
  
```
pip install Flask
``` 
  
```
sudo pip install Flask
```   

## Despliegue 📦
<ol>
  <li> Para la instalación de la parte web, y ya teniendo instalado NPM,  a la persona que quiera trabajar con el código traído desde un repositorio o de manera remota se descargará el código sin las librerías y dependencias del proyecto, pero las instará de forma sencilla mediante el comando de terminal «npm install»  que instalará todas las dependencias registradas en el archivo package.json</li>
 </ol>
  <h5> El programa utiliza la librería express, que permite la conexión de la parte del servidor, con el apartado web, para lograr aplicaciones web conectando tanto el front-end, como en el back-end en JavaScript. </h5>
  <h3> El comando para la ejecución del programa se vería de la siguiente manera: </h3> 
  
  <ul>
    <li> Para ejecutar el entorno web: Parte programada con NodeJS y Handlebars </li>
  </ul>
  
```
node server.js
```
   <ul>
    <li> Para ejecutar el entorno de la API programada en Python y Flask </li>
  </ul> 
  
```
python app.js
```

## Construido con 🛠️

  <h5> Librerías NPM </h5>

* [axios](https://www.npmjs.com/package/axios) -Cliente HTTP basado en promesas para el navegador y node.js, permite traer llamados a una API externa.
* [bcryptjs](https://www.npmjs.com/package/bcryptjs) - se basa en la interfaz getRandomValues ​​de Web Crypto API para obtener números aleatorios seguros
* [date-and-time](https://www.npmjs.com/package/date-and-time) - Es  una colección de funciones para manipular la fecha y la hora.
* [dotenv](https://www.npmjs.com/package/dotenv) - Dotenv es un módulo de dependencia cero que carga variables de entorno desde un .env archivo a process.env. El almacenamiento de la configuración en el entorno por separado del código.
* [express](https://www.npmjs.com/package/express) - Marco web minimalista, rápido y sin supervisión para nodo, permite la conexión a un servidor.
* [express-session](https://www.npmjs.com/package/express-session) - Crea un middleware de sesión con el archivo options, y permite navegación de sesiones en el servidor.
* [fs](https://nodejs.dev/learn/the-nodejs-fs-module) -  proporciona una gran cantidad de funciones muy útiles para acceder e interactuar con el sistema de archivos.
* [hbs](https://www.npmjs.com/package/hbs) - El uso de hbs como motor de visualización predeterminado requiere solo una línea de código en la configuración de su aplicación, para handlebars.js.
* [mime-types](https://www.npmjs.com/package/mime-types) - Cree un encabezado de tipo de contenido completo dado un tipo de contenido o una extensión.
* [moment](https://www.npmjs.com/package/moment) - Una biblioteca de fechas de JavaScript para analizar, validar, manipular y formatear fechas. 
* [multer](https://www.npmjs.com/package/multer) - Es un middleware de node.js para el manejo multipart/form-data, que se usa principalmente para cargar archivos. Está escrito en la parte superior del ayudante de camarero para una máxima eficiencia.
* [node-fetch](https://www.npmjs.com/package/node-fetch) - Es  una colección para hacer peticiones a una API y traerlas de manera sencilla.
* [pg](https://www.npmjs.com/package/pg) - Cliente PostgreSQL sin bloqueo para Node.js. JavaScript puro y enlaces libpq nativos opcionales.
  <h5> Extras </h5>
* [CSS](https://www.w3schools.com/css/) - Es un lenguaje de diseño gráfico para definir y crear la presentación de un documento estructurado escrito en un lenguaje de marcado.
* [SCSS](https://sass-lang.com/) - Sass es un metalenguaje de Hojas de Estilo en Cascada (CSS). Es un lenguaje de script en sí mismo. Sass consiste en dos sintaxis. La sintaxis original, llamada indented syntax («sintaxis con sangrado»), que usa la sangría para separar bloques de código y el carácter nueva línea para separar reglas. La sintaxis más reciente, SCSS, usa el formato de bloques como CSS. Este usa llaves para denotar bloques de código y punto y coma (;) para separar las líneas dentro de un bloque. 
  

  
## Autores ✒️

* **Amarilis Cueva** - *Estudiante Ingeniería en Ciencias de la Computación* - [Amarilis7616](https://github.com/Amarilis7616)
* **Edwin Hernández** - *Estudiante Ingeniería en Ciencias de la Computación* - [fonsiher](https://github.com/fonsiher)
* **Jefry Navas** - *Estudiante Ingeniería en Ciencias de la Computación* - [JefryNavas](https://github.com/JefryNavas)
* **Joel Yunga** - *Estudiante Ingeniería en Ciencias de la Computación* - [JoelYunga](https://github.com/JoelYunga)

También puedes mirar la lista de todos los [contribuyentes](https://github.com/your/project/contributors) quíenes han participado en este proyecto. 

## Licencia 📄

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Licencia Creative Commons" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />Esta obra está bajo una <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional</a>.
