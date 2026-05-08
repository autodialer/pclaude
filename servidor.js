const http = require('http');
const fs = require('fs');

const proyectos = [
    { id: 1, titulo: "Proyecto 1", descripcion: "Aplicación web de tareas.", icono: "fa-code" },
    { id: 2, titulo: "Proyecto 2", descripcion: "Diseño de app móvil.", icono: "fa-palette" },
    { id: 3, titulo: "Proyecto 3", descripcion: "Página web responsive.", icono: "fa-mobile-alt" }
];

const servidor = http.createServer(function (solicitud, respuesta) {

    if (solicitud.url === '/' || solicitud.url === '/index.html') {
        const html = fs.readFileSync('index.html', 'utf8');
        respuesta.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        respuesta.end(html);
    } else if (solicitud.url === '/styles.css') {
        const css = fs.readFileSync('styles.css', 'utf8');
        respuesta.writeHead(200, { 'Content-Type': 'text/css' });
        respuesta.end(css);
    } else if (solicitud.url === '/script.js') {
        const js = fs.readFileSync('script.js', 'utf8');
        respuesta.writeHead(200, { 'Content-Type': 'application/javascript' });
        respuesta.end(js);
    } else if (solicitud.url === '/api/proyectos') {
        respuesta.writeHead(200, { 'Content-Type': 'application/json' });
        respuesta.end(JSON.stringify(proyectos));
    } else {
        respuesta.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        respuesta.end('<h1>404 - Página no encontrada</h1>');
    }

});

servidor.listen(3000, function () {
    console.log('Servidor corriendo en http://localhost:3000');
});