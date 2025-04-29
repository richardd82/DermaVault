const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const patientRoutes = require('./patientRoutes');
const medicalHistoryRoutes = require('./medicalHistoryRoutes'); // Si tienes un archivo de rutas para MedicalHistory
const patientsArray = require('./patientsArrayChunks'); // Si tienes un archivo de rutas para pacientesArrayChunks
const adminDataRoutes = require('./adminDataRoutes'); // Si tienes un archivo de rutas para datos administrativos
const backupRoutes = require('./backupRoutes'); // Si tienes un archivo de rutas para backup y restore

// Agregar las rutas individuales
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/patients', patientRoutes);
router.use('/histories', medicalHistoryRoutes);
router.use('/patientsArrayChunks', patientsArray); // Si tienes un archivo de rutas para pacientesArrayChunks
router.use('/adminData', adminDataRoutes); // Si tienes un archivo de rutas para datos administrativos
router.use('/backup', backupRoutes); // Si tienes un archivo de rutas para backup y restore
// Si tuvieras otras rutas, por ejemplo, para MedicalHistory, las agregarías así:
// router.use('/medical-histories', require('./medicalHistoryRoutes'));

module.exports = router;
