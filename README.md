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
<li>Una vez instalado para commprobar la correcta instalación se puede crear un pequeño programa en Visual Studio Code con extensión .js y se lo ejecuta en la terminal con el formato: <b>node archivo.js<b> </li>
  </ol> 
  
<br/>
<h4>Instalación de Node Package Manager NPM</h4>
<ol>
  <li>Para instalar npm hay que escribir en el terminal del Sistema Operativo o del propio Visual estudio:  «npm install npm@latest -g» y pulsar Intro</li>
  <li>Teniendo instalado NPM se coloca en el terminal: <<npm init>>, aquí dentro de nuestro proyecto aparecerá un archivo muy importante llamando package.json, mismo que muestra nombre, versión, descripción, autor, el archivo main, y finalmente muestra las dependencias del proyecto, es decir todos los paquetes o módulos que se hayan instalando para el proyecto en cuestión. </li>
  </ol>
  
  <br/>
<h4>Instalación de Entorno de Flask (Python)</h4>
<ol>
  <li>Para instalar npm hay que escribir en el terminal del Sistema Operativo o del propio Visual estudio:  «npm install npm@latest -g» y pulsar Intro</li>
  <li>Teniendo instalado NPM se coloca en el terminal: <<npm init>>, aquí dentro de nuestro proyecto aparecerá un archivo muy importante llamando package.json, mismo que muestra nombre, versión, descripción, autor, el archivo main, y finalmente muestra las dependencias del proyecto, es decir todos los paquetes o módulos que se hayan instalando para el proyecto en cuestión. </li>
  </ol>

## Despliegue 📦
<ol>
  <li>Teniendo instalado NPM  a la persona que quiera trabajar con el código traído desde un repositorio o de manera remota se descargará el código sin las librerías y dependencias del proyecto, pero las instará de forma sencilla mediante el comando de terminal <<npm install>> que instalará todas las dependencias registradas en el archivo package.json</li>
 </ol>
  <h5> El programa utiliza la librería npm yargs, que permite que el programa pueda ejecutarse en la terminal al estilo de llamados por línea de comandos de bash </h5>
  <h5>El programa dispone de dos comandos: </h5
  <ol>
    <li> <b>Publicar:</b> Este comando publicará las estadísticas en una página web básica. Se requieren de tres parámetros:
       <ul>
         <li>--file -f: Permite establecer el path del archivo CSV que contiene los datos a analizar</li>
         <li>--country -c: Permite determinar el país a analizar a través de su código ISO 3166 ALPHA-3</li>
         <li>--year -y: Permite especificar el año para el cual se requiere las estadísticas. Por defecto, 2018.</li>
      </ul> 
    </li>
    <li> <b> Guardar: </b> Este comando almacenará los resultados de las estadísticas en un archivo json. Recibe los mismos parámetros que el comando anterior, y se adiciona la siguiente opción:
        <ul>
              <li>--out -o: Establece el nombre del archivo donde se almacenará los resultados</li>
      </ul>  
  </li>
</ol>

  <h3> El comando para la ejecución del programa se vería de la siguiente manera: </h3> 
  
  <ul>
    <li> Para publicar: Tomando ejemplo datos de Ecuador (ECU) en el año 2016 </li>
  </ul>
  
```
node app.js publicar -f "tu_path\.csv" -c "ECU" -y 2016 
```
   <ul>
    <li> Para Guardar: Tomando ejemplo datos de Ecuador (USA) en el año 2019 </li>
  </ul> 
  
```
node app.js guardar -f "tu_Path\datos.csv" -c "USA" -y 2019 -o "Datos USA"
```
  
## Construido con 🛠️

  <h5> Librerías NPM </h5>

* [yargs](https://www.npmjs.com/package/yargs) - Ayuda a crear herramientas de línea de comandos interactivas, analizando argumentos y generando una elegante interfaz de usuario.
* [colors](https://www.npmjs.com/package/colors) - Dar color y estilo la impresiones por consola node.js
* [neat-csv](https://www.npmjs.com/package/neat-csv) - Analizador CSV rápido
  <h5> Extras </h5>
* [CSS](https://www.w3schools.com/css/) - Es un lenguaje de diseño gráfico para definir y crear la presentación de un documento estructurado escrito en un lenguaje de marcado.


## Versionado 📌
Se realizó un versionamiente mediante los tags de git, en total se ha lanzado solo una versión con una modificación. 
<ol>
  <li> Versión 1.0.0: Contiene La impresión básica por consola y guardado en JSON </li>
  <li>Versión 1.0.1: Contiene la impresión mejorada por consola, y añadido la impresión de los resultados en un servidor web local </li>
</ol>  
  
  

## Autor ✒️

* **Edwin Hernández** - *Estudiante Ingeniería en Ciencias de la Computación* - [fonsiher](https://github.com/fonsiher)

También puedes mirar la lista de todos los [contribuyentes](https://github.com/your/project/contributors) quíenes han participado en este proyecto. 

## Licencia 📄

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Licencia Creative Commons" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />Esta obra está bajo una <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional</a>.
