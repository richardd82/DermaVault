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
  "https://derma.richadd82.dev",  // Tu frontend en producción
  "http://192.168.100.77:5173", // Permitir cualquier origen (no recomendado para producción)
  "http://192.168.100.77", // Permitir cualquier origen (no recomendado para producción)
  "http://192.168.100.53:5173" // Permitir cualquier origen (no recomendado para producción)
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
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});
app.use(morgan('dev'));
app.use(express.json({ limit: '4096mb'}));
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