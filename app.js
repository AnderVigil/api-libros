// Importamos Express para poder crear el servidor y manejar las rutas de la API.
// Esta línea se ejecuta cuando iniciamos la aplicación con node app.js.
const express = require('express');

// Creamos una aplicación de Express.
// Esta constante "app" nos permite definir rutas como GET, POST, etc.
const app = express();

// Definimos el puerto donde se ejecutará el servidor.
// Si Render asigna un puerto automáticamente, se usará process.env.PORT.
// Si estamos en nuestra computadora, usará el puerto 3000.
const PORT = process.env.PORT || 3000;

// Middleware para que Express pueda recibir y responder datos en formato JSON.
// Se invoca automáticamente antes de procesar las rutas.
app.use(express.json());

// Arreglo de objetos que almacena los libros en memoria.
// Esta información se pierde si el servidor se reinicia, porque no estamos usando base de datos.
const libros = [
  {
    id: 1,
    nombre: 'El Principito',
    anioPublicacion: 1943
  },
  {
    id: 2,
    nombre: 'Cien años de soledad',
    anioPublicacion: 1967
  },
  {
    id: 3,
    nombre: 'Don Quijote de la Mancha',
    anioPublicacion: 1605
  },
  {
    id: 4,
    nombre: 'La Odisea',
    anioPublicacion: -800
  },
  {
    id: 5,
    nombre: 'Rayuela',
    anioPublicacion: 1963
  }
];

// Ruta principal de la API.
// Se invoca cuando el usuario entra a la ruta GET /
// Devuelve un mensaje en formato JSON indicando que la API está funcionando.
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API básica de libros funcionando correctamente',
    rutasDisponibles: [
      'GET /libros',
      'GET /libros/buscar?nombre=principito',
      'GET /libros/:id'
    ]
  });
});

// Ruta estática para listar todos los libros.
// Se invoca cuando el usuario hace una petición GET a /libros.
// Devuelve un JSON con todos los libros disponibles en el arreglo.
app.get('/libros', (req, res) => {
  res.json({
    mensaje: 'Listado de libros disponibles',
    total: libros.length,
    libros: libros
  });
});

// Ruta para buscar libros por nombre usando parámetro de consulta.
// Se invoca cuando el usuario hace una petición GET a /libros/buscar?nombre=texto
// Ejemplo: /libros/buscar?nombre=principito
app.get('/libros/buscar', (req, res) => {
  // Obtenemos el valor del parámetro "nombre" enviado en la URL.
  const nombreBuscado = req.query.nombre;

  // Validamos que el usuario haya enviado el parámetro nombre.
  if (!nombreBuscado) {
    return res.status(400).json({
      mensaje: 'Debe enviar un nombre de libro para realizar la búsqueda'
    });
  }

  // Filtramos los libros cuyo nombre incluya el texto buscado.
  // Se usa toLowerCase() para que la búsqueda no distinga entre mayúsculas y minúsculas.
  const resultado = libros.filter((libro) =>
    libro.nombre.toLowerCase().includes(nombreBuscado.toLowerCase())
  );

  // Si no se encuentran libros, respondemos con error 404 en formato JSON.
  if (resultado.length === 0) {
    return res.status(404).json({
      mensaje: 'No se encontraron libros con ese nombre'
    });
  }

  // Si se encuentran resultados, los devolvemos en formato JSON.
  res.json({
    mensaje: 'Resultado de la búsqueda',
    total: resultado.length,
    libros: resultado
  });
});

// Ruta dinámica para obtener un libro por su ID.
// Se invoca cuando el usuario hace una petición GET a /libros/:id
// Ejemplo: /libros/1
app.get('/libros/:id', (req, res) => {
  // Convertimos el ID recibido en la URL a número.
  const id = parseInt(req.params.id);

  // Buscamos en el arreglo el libro que tenga el ID solicitado.
  const libroEncontrado = libros.find((libro) => libro.id === id);

  // Si no existe un libro con ese ID, respondemos con error 404 en formato JSON.
  if (!libroEncontrado) {
    return res.status(404).json({
      mensaje: 'Libro no encontrado'
    });
  }

  // Si el libro existe, devolvemos sus detalles en formato JSON.
  res.json({
    mensaje: 'Detalle del libro encontrado',
    libro: libroEncontrado
  });
});

// Ruta para manejar cualquier dirección que no exista en la API.
// Se invoca cuando el usuario entra a una ruta no definida.
app.use((req, res) => {
  res.status(404).json({
    mensaje: 'Ruta no encontrada'
  });
});

// Iniciamos el servidor.
// Esta función se invoca cuando ejecutamos el archivo app.js.
// Muestra en consola la dirección donde está corriendo la API.
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});