// Aquí llamo a Express, que es la librería que voy a usar para crear la API.
const express = require('express');

// Aquí creo la aplicación de Express para poder trabajar con las rutas.
const app = express();

// Defino el puerto donde se va a ejecutar el servidor.
// En la computadora usa el puerto 3000 y en Render usa el puerto que Render asigne.
const PORT = process.env.PORT || 3000;

// Esto permite que la API pueda trabajar con respuestas en formato JSON.
app.use(express.json());

// Este arreglo guarda los libros en memoria.
// No se usa base de datos, por eso los datos están directamente en el código.
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
    anioPublicacion: 1949
  },
  {
    id: 5,
    nombre: 'Rayuela',
    anioPublicacion: 1963
  }
];

// Esta ruta se ejecuta cuando se entra a la página principal de la API.
// Sirve para comprobar que el servidor está funcionando.
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

// Esta ruta se ejecuta cuando se hace una petición GET a /libros.
// Devuelve todos los libros que están guardados en el arreglo.
app.get('/libros', (req, res) => {
  res.json({
    mensaje: 'Listado de libros disponibles',
    total: libros.length,
    libros: libros
  });
});

// Esta ruta permite buscar libros por nombre.
// Se invoca usando una ruta como: /libros/buscar?nombre=principito
app.get('/libros/buscar', (req, res) => {
  // Aquí tomo el nombre que viene en la URL.
  const nombreBuscado = req.query.nombre;

  // Si no se escribe ningún nombre, se devuelve un error.
  if (!nombreBuscado) {
    return res.status(400).json({
      mensaje: 'Debe enviar un nombre de libro para realizar la búsqueda'
    });
  }

  // Aquí se buscan los libros que contengan el texto escrito por el usuario.
  // Se usa minúscula para que la búsqueda funcione aunque se escriba diferente.
  const resultado = libros.filter((libro) =>
    libro.nombre.toLowerCase().includes(nombreBuscado.toLowerCase())
  );

  // Si no se encuentra ningún libro, se responde con un mensaje de error.
  if (resultado.length === 0) {
    return res.status(404).json({
      mensaje: 'No se encontraron libros con ese nombre'
    });
  }

  // Si sí se encuentran libros, se devuelve el resultado en JSON.
  res.json({
    mensaje: 'Resultado de la búsqueda',
    total: resultado.length,
    libros: resultado
  });
});

// Esta ruta se usa para buscar un libro por su ID.
// Se invoca con una ruta como: /libros/1
app.get('/libros/:id', (req, res) => {
  // Convierto el ID recibido a número, porque en la URL llega como texto.
  const id = parseInt(req.params.id);

  // Busco dentro del arreglo el libro que tenga el mismo ID.
  const libroEncontrado = libros.find((libro) => libro.id === id);

  // Si no existe un libro con ese ID, se devuelve un error 404.
  if (!libroEncontrado) {
    return res.status(404).json({
      mensaje: 'Libro no encontrado'
    });
  }

  // Si el libro existe, se muestra la información del libro encontrado.
  res.json({
    mensaje: 'Detalle del libro encontrado',
    libro: libroEncontrado
  });
});

// Esta parte se ejecuta cuando el usuario entra a una ruta que no existe.
// Sirve para manejar errores de rutas incorrectas.
app.use((req, res) => {
  res.status(404).json({
    mensaje: 'Ruta no encontrada'
  });
});

// Aquí se inicia el servidor.
// Esta parte se ejecuta cuando corremos el proyecto con npm start o node app.js.
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});