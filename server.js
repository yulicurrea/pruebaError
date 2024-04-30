const express = require('express');
const path = require('path');

const app = express();

// Sirve los archivos estáticos desde la carpeta dist
app.use(express.static(__dirname + '/dist/frontend'));

// Enruta todas las demás rutas al index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/frontend/index.html'));
});

// Inicia el servidor en el puerto asignado por Heroku
app.listen(process.env.PORT || 8080);