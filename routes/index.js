const express = require('express');
const router = express.Router();

// Agregar las rutas individuales
router.use('/', require('./patientRoutes'));
// Si tuvieras otras rutas, por ejemplo, para MedicalHistory, las agregarías así:
// router.use('/medical-histories', require('./medicalHistoryRoutes'));

module.exports = router;
