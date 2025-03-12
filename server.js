require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const db = require('./models'); // Cargar modelos

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('DermaVault API Running 🚀');
});

// Sincronizar base de datos
db.sequelize.sync().then(() => {
    console.log("Database connected!");
});

// Iniciar el servidor
db.sequelize.sync({ alter: false })  
  .then(() => {
    console.log('Base de datos sincronizada');
    // Iniciar el servidor una vez sincronizada la BD
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('Error al sincronizar la base de datos:', err));

