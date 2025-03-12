// routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const { Patient } = require("../models"); // Asegúrate que models/index.js exporte Patient
const moment = require("moment");

// GET /api/patients - Obtener todos los pacientes
router.get("/patients", async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.json(patients);
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    res.status(500).json({ message: "Error al obtener pacientes" });
  }
});

// GET /api/patient/:id - Obtener un paciente por ID
router.get("/patient/:id", async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }
    res.json(patient);
  } catch (error) {
    console.error("Error al obtener el paciente:", error);
    res.status(500).json({ message: "Error al obtener el paciente" });
  }
});
// POST /api/patient - Crear un paciente
router.post("/patient", async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    console.error("Error al crear el paciente:", error);
    res.status(500).json({ message: "Error al crear el paciente" });
  }
});

//Post /api/patientsArray - Crear un array de pacientes
router.post("/patientsArray", async (req, res) => {
  try {
    const formattedPatients = req.body.map((patient) => ({
      ...patient,
      fecha_nacimiento: moment(patient.fecha_nacimiento, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      ),
    }));
    console.log(formattedPatients, "formattedPatients");
    const patients = await Patient.bulkCreate(formattedPatients);
    res.status(201).json(patients);
  } catch (error) {
    console.error("Error al crear el paciente:", error);
    res.status(500).json({ message: "Error al crear el paciente" });
  }
});
module.exports = router;
