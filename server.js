require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require("path");

const {
  sequelize,
  AdministrativeData,
  Allergy,
  ClinicalData,
  Diagnosis,
  EvolutionDate,
  GeneralMedicalHistory,
  MedicalHistory,
  Patient,
  User
} = require("./models");

const routes = require('./routes');
const allowedOrigins = [
  "http://localhost:5173", // Desarrollo local
  "https://derma.richadd82.dev" // Tu frontend en producción
];

const app = express();
app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir sin origin para herramientas como Thunder
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS no permitido"));
      }
    },
    credentials: false, // Si usas cookies o auth headers
  })
);
app.use(morgan('dev'));
app.use(express.json({ limit: '4096mb' }));
app.use(express.urlencoded({ extended: true, limit: '4096mb' }));
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('DermaVault API Running 🚀');
});

const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== "production";

// ✅ Solo una vez y en el orden correcto
async function safeSync() {
  try {
    await sequelize.authenticate();

    // Sincronizar en orden respetando relaciones
    await User.sync();
    await Patient.sync();
    await MedicalHistory.sync();
    await ClinicalData.sync();
    await Allergy.sync();
    await Diagnosis.sync();
    await EvolutionDate.sync();
    await GeneralMedicalHistory.sync();
    await AdministrativeData.sync();

    await sequelize.sync({ alter: false }); // actualiza sin borrar datos
    console.log("🛠️ Base de datos sincronizada con éxito");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error al sincronizar la base de datos:", err);
  }
}

safeSync();


// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const morgan = require('morgan');
// const bodyParser = require('body-parser');
// const db = require('./models'); // Cargar modelos
// const routes = require('./routes');
// const {
//   sequelize,
//   AdministrativeData,
//   Allergy,
//   ClinicalData,
//   Diagnosis,
//   EvolutionDate,
//   GeneralMedicalHistory,
//   MedicalHistory,
//   Patient,
//   User
//   // otros modelos
// } = require("./models");

// const app = express();

// // Middlewares
// app.use(cors("*"));
// app.use(morgan('dev'));
// // app.use(bodyParser.json());
// app.use(express.json({ limit: '4096mb' }));
// app.use(express.urlencoded({ extended: true, limit: '4096mb' }));
// app.use('/api', routes);
// // Ruta de prueba
// app.get('/', (req, res) => {
//     res.send('DermaVault API Running 🚀');
// });

// // Sincronizar base de datos
// db.sequelize.sync().then(() => {
//     console.log("Database connected!");
// });

// // Iniciar el servidor
// const isDev = process.env.NODE_ENV !== 'production';

// async function safeSync() {
//   await User.sync();
//   await Patient.sync();

//   await MedicalHistory.sync();
  
//   await ClinicalData.sync();
//   await Allergy.sync();
//   await Diagnosis.sync();
//   await EvolutionDate.sync();
//   await GeneralMedicalHistory.sync();

//   await AdministrativeData.sync();

//   await sequelize.sync({ alter: true }); // aplicar cambios adicionales
//   console.log("🛠️ Base de datos sincronizada con éxito");
// }

// safeSync().catch((err) => {
//   console.error("❌ Error al sincronizar la base de datos:", err);
// });


// db.sequelize.sync({ force: true, logging:false }) // alter solo en desarrollo
//   .then(() => {
//     console.log('Base de datos sincronizada');
//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
//   })
//   .catch(err => console.error('Error al sincronizar la base de datos:', err));

//   safeSync().catch((err) => {
//     console.error("❌ Error al sincronizar la base de datos:", err);
//   });

// // db.sequelize.sync({ alter: true })  // Si alter es true, se sincroniza la BD y se crean las tablas si no existen
// //   .then(() => db.sequelize.sync({ force: false })) // Si force es true, se sincroniza la BD y se eliminan las tablas si existen
// //   .then(() => {
// //     console.log('Base de datos sincronizada');
// //     // Iniciar el servidor una vez sincronizada la BD
// //     const PORT = process.env.PORT || 3000;
// //     app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
// //   })
// //   .catch(err => console.error('Error al sincronizar la base de datos:', err));

