const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const patientRoutes = require('./patientRoutes');

// Agregar las rutas individuales
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/patients', patientRoutes);
// Si tuvieras otras rutas, por ejemplo, para MedicalHistory, las agregarías así:
// router.use('/medical-histories', require('./medicalHistoryRoutes'));

module.exports = router;
