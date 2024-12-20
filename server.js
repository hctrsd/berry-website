const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware para servir archivos estáticos (HTML, CSS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para procesar el formulario de inscripción
app.post('inscripcion', (req, res) => {
  const { nombre, email, telefono, tipo, mensaje } = req.body;

  if (!nombre || !email || !tipo) {
    return res.status(400).send('Todos los campos son obligatorios');
  }

  // Cargar inscripciones previas
  const filePath = path.join(__dirname, 'data', 'inscripciones.json');
  let inscripciones = [];
  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath);
    inscripciones = JSON.parse(rawData);
  }

  // Crear un nuevo objeto con los datos del formulario
  const nuevaInscripcion = {
    nombre,
    email,
    telefono,
    tipo,
    mensaje,
    fecha: new Date().toISOString()
  };

  // Añadir la nueva inscripción al array
  inscripciones.push(nuevaInscripcion);

  // Guardar los datos en el archivo JSON
  fs.writeFileSync(filePath, JSON.stringify(inscripciones, null, 2));

  // Enviar una respuesta de éxito
  res.send('<h1>Inscripción exitosa!</h1><p><a href="/">Volver al inicio</a></p>');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

