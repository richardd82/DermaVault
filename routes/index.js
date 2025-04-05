const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const patientRoutes = require('./patientRoutes');
const medicalHistoryRoutes = require('./medicalHistoryRoutes'); // Si tienes un archivo de rutas para MedicalHistory

// Agregar las rutas individuales
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/patients', patientRoutes);
router.use('/histories', medicalHistoryRoutes);
// Si tuvieras otras rutas, por ejemplo, para MedicalHistory, las agregarías así:
// router.use('/medical-histories', require('./medicalHistoryRoutes'));

module.exports = router;
