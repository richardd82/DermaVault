require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const db = require('./models'); // Cargar modelos
const routes = require('./routes');

const app = express();

// Middlewares
app.use(cors("*"));
app.use(morgan('dev'));
// app.use(bodyParser.json());
app.use(express.json({ limit: '4096mb' }));
app.use(express.urlencoded({ extended: true, limit: '4096mb' }));
app.use('/api', routes);
// Ruta de prueba
app.get('/', (req, res) => {
    res.send('DermaVault API Running 🚀');
});

// Sincronizar base de datos
db.sequelize.sync().then(() => {
    console.log("Database connected!");
});

// Iniciar el servidor
const isDev = process.env.NODE_ENV !== 'production';

db.sequelize.sync({ alter: true, logging:false }) // alter solo en desarrollo
  .then(() => {
    console.log('Base de datos sincronizada');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('Error al sincronizar la base de datos:', err));

// db.sequelize.sync({ alter: true })  // Si alter es true, se sincroniza la BD y se crean las tablas si no existen
//   .then(() => db.sequelize.sync({ force: false })) // Si force es true, se sincroniza la BD y se eliminan las tablas si existen
//   .then(() => {
//     console.log('Base de datos sincronizada');
//     // Iniciar el servidor una vez sincronizada la BD
//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
//   })
//   .catch(err => console.error('Error al sincronizar la base de datos:', err));

