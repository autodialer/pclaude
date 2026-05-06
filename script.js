const formulario = document.querySelector('.formulario');

formulario.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;

    if (nombre === '' || email === '' || mensaje === '') {
        alert('Por favor llena todos los campos.');
        return;
    }

    alert('Gracias ' + nombre + ', tu mensaje fue enviado correctamente.');
    formulario.reset();
});

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
});

document.querySelectorAll('.animar').forEach(function (el) {
    observer.observe(el);
});

const botonModo = document.getElementById('modo-oscuro');

botonModo.addEventListener('click', function () {
    document.body.classList.toggle('oscuro');

    const icono = botonModo.querySelector('i');
    if (document.body.classList.contains('oscuro')) {
        icono.classList.replace('fa-moon', 'fa-sun');
    } else {
        icono.classList.replace('fa-sun', 'fa-moon');
    }
});

const proyectos = [
    {
        titulo: "Proyecto 1",
        descripcion: "Aplicación web de gestión de tareas.",
        icono: "fa-code"
    },
    {
        titulo: "Proyecto 2",
        descripcion: "Diseño de interfaz para app móvil.",
        icono: "fa-palette"
    },
    {
        titulo: "Proyecto 3",
        descripcion: "Página web responsive para negocio.",
        icono: "fa-mobile-alt"
    }
];

const contenedorTarjetas = document.querySelector('.tarjetas');
contenedorTarjetas.innerHTML = '';

proyectos.forEach(function (proyecto) {
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta', 'animar');
    tarjeta.innerHTML = `
        <i class="fas ${proyecto.icono} fa-2x" style="color: #3498db;"></i>
        <h3>${proyecto.titulo}</h3>
        <p>${proyecto.descripcion}</p>
    `;
    contenedorTarjetas.appendChild(tarjeta);
    observer.observe(tarjeta);
});