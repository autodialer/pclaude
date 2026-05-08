const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const db = new Database('proyectos.db');
const SECRET = 'mi_clave_secreta_123';

app.use(express.static('.'));
app.use(express.json());

// Crear tablas
db.exec(`
    CREATE TABLE IF NOT EXISTS proyectos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descripcion TEXT NOT NULL,
        icono TEXT DEFAULT 'fa-code'
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`);

// Datos iniciales
const total = db.prepare('SELECT COUNT(*) as total FROM proyectos').get();
if (total.total === 0) {
    db.prepare('INSERT INTO proyectos (titulo, descripcion, icono) VALUES (?, ?, ?)').run('Proyecto 1', 'Aplicación web de tareas.', 'fa-code');
    db.prepare('INSERT INTO proyectos (titulo, descripcion, icono) VALUES (?, ?, ?)').run('Proyecto 2', 'Diseño de app móvil.', 'fa-palette');
    db.prepare('INSERT INTO proyectos (titulo, descripcion, icono) VALUES (?, ?, ?)').run('Proyecto 3', 'Página web responsive.', 'fa-mobile-alt');
}

// Middleware para verificar token
function verificarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado' });
    }
    try {
        const verificado = jwt.verify(token, SECRET);
        req.usuario = verificado;
        next();
    } catch (e) {
        res.status(401).json({ error: 'Token inválido' });
    }
}

// Registro
app.post('/api/registro', async function (req, res) {
    const { nombre, email, password } = req.body;
    const passwordEncriptada = await bcrypt.hash(password, 10);
    try {
        const resultado = db.prepare('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)').run(nombre, email, passwordEncriptada);
        res.status(201).json({ mensaje: 'Usuario creado correctamente' });
    } catch (e) {
        res.status(400).json({ error: 'El correo ya está registrado' });
    }
});

// Login
app.post('/api/login', async function (req, res) {
    const { email, password } = req.body;
    const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
    if (!usuario) {
        return res.status(400).json({ error: 'Usuario no encontrado' });
    }
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
        return res.status(400).json({ error: 'Contraseña incorrecta' });
    }
    const token = jwt.sign({ id: usuario.id, nombre: usuario.nombre }, SECRET);
    res.json({ token, nombre: usuario.nombre });
});

// Rutas de proyectos
app.get('/api/proyectos', function (req, res) {
    const proyectos = db.prepare('SELECT * FROM proyectos').all();
    res.json(proyectos);
});

app.post('/api/proyectos', verificarToken, function (req, res) {
    const resultado = db.prepare('INSERT INTO proyectos (titulo, descripcion, icono) VALUES (?, ?, ?)').run(req.body.titulo, req.body.descripcion, req.body.icono || 'fa-code');
    const nuevo = db.prepare('SELECT * FROM proyectos WHERE id = ?').get(resultado.lastInsertRowid);
    res.status(201).json(nuevo);
});

app.delete('/api/proyectos/:id', verificarToken, function (req, res) {
    db.prepare('DELETE FROM proyectos WHERE id = ?').run(req.params.id);
    res.json({ mensaje: 'Proyecto eliminado' });
});

app.listen(3000, function () {
    console.log('Servidor corriendo en http://localhost:3000');
});