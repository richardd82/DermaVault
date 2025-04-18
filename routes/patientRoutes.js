// routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const { Patient } = require("../models"); // Asegúrate que models/index.js exporte Patient
const moment = require("moment");
const auth = require("../middleware/auth");
const { Op, Sequelize  } = require("sequelize");

// GET /api/patients - Obtener todos los pacientes
router.get("/patients", auth, async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const offset = req.query.offset ? parseInt(req.query.offset) : null;

    if (limit === null || offset === null || isNaN(limit) || isNaN(offset)) {
      return res.status(400).json({ message: "Parámetros 'limit' y 'offset' requeridos y válidos" });
    }

    const MAX_LIMIT = 1000;
    if (limit > MAX_LIMIT) {
      return res.status(400).json({ message: `Límite máximo permitido: ${MAX_LIMIT}` });
    }
    
    const { count, rows } = await Patient.findAndCountAll({
      limit,
      offset,
      order: [
        [Sequelize.literal("CAST(SUBSTRING_INDEX(cedula, '-', -1) AS UNSIGNED)"), "DESC"]
      ],
    });

    res.json({
      total: count,
      patients: rows,
      hasMore: offset + limit < count,
    });
  } catch (error) {
    console.error("Error al obtener pacientes paginados:", error);
    res.status(500).json({ message: "Error al obtener pacientes" });
  }
});

// GET /api/patients/:id - Obtener un paciente por ID
router.get("/patient/:id", auth, async (req, res) => {
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
// POST /api/patients/ - Crear un paciente
router.post("/patient", auth, async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    console.error("Error al crear el paciente:", error);
    res.status(500).json({ message: "Error al crear el paciente" });
  }
});

//Post /api/patients/patientsArray - Crear un array de pacientes
router.post("/patientsArray", auth, async (req, res) => {
  try {
    const formattedPatients = req.body.map((patient) => {
      // Verificamos si la fecha_nacimiento es válida
      const parsedDate = moment(patient.fecha_nacimiento, "DD/MM/YYYY", true);
      const fechaNacimientoFormatted = parsedDate.isValid()
        ? parsedDate.format("YYYY-MM-DD")
        : null;

      // Reemplazamos "Vacío" por null en todos los campos
      const cleanedPatient = Object.fromEntries(
        Object.entries(patient).map(([key, value]) => [
          key,
          value === "Vacío" ? null : value,
        ])
      );

      return {
        ...cleanedPatient,
        fecha_nacimiento: fechaNacimientoFormatted,
      };
    });

    // Obtener todas las cédulas ya registradas
    const existingPatients = await Patient.findAll({
      attributes: ["cedula"],
    });

    const existingCedulas = new Set(existingPatients.map((p) => p.cedula));

    // Filtrar pacientes que no estén duplicados por cédula
    const newPatients = formattedPatients.filter(
      (p) => !existingCedulas.has(p.cedula)
    );

    // Insertar los nuevos
    const inserted = await Patient.bulkCreate(newPatients);

    res.status(201).json({
      insertedCount: inserted.length,
      skippedCount: formattedPatients.length - inserted.length,
      message: "Carga finalizada correctamente",
    });
  } catch (error) {
    console.error("Error al crear el paciente:", error);
    res.status(500).json({ message: "Error al crear el paciente" });
  }
});

//Put /api/patients/patient/:id - Actualizar un paciente
router.put("/patient/:id", auth, async (req, res) => {
  try {
    // console.log(req.params, "<*******************");
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }
    await patient.update(req.body);
    res.json(patient);
  } catch (error) {
    console.error("Error al actualizar el paciente:", error);
    res.status(500).json({ message: "Error al actualizar el paciente" });
  }
});
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q?.trim();

    if (!q || q.length < 2) {
      return res.status(400).json({ message: "Consulta muy corta" });
    }

    const isCedula = /^m-\d+$/i.test(q) || /^\d+$/i.test(q);

    const whereClause = isCedula
      ? {
          cedula: {
            [Op.like]: `%${q}%`
          }
        }
      : {
          [Op.or]: [
            { nombre: { [Op.like]: `%${q}%` } },
            { apellido: { [Op.like]: `%${q}%` } },
            { cedula: { [Op.like]: `%${q}%` } },
            { email: { [Op.like]: `%${q}%` } }
          ]
        };

    const results = await Patient.findAll({
      where: whereClause,
      order: [["updatedAt", "DESC"]]
    });

    res.json(results);
  } catch (err) {
    console.error("Error en búsqueda de pacientes:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// router.get("/search", auth, async (req, res) => {
//   const { q } = req.query;

//   const results = await Patient.findAll({
//     where: {
//       [Op.or]: [
//         { nombre: { [Op.like]: `%${q}%` } },
//         { apellido: { [Op.like]: `%${q}%` } },
//         { cedula: { [Op.like]: `%${q}%` } },
//         { email: { [Op.like]: `%${q}%` } },
//       ],
//     },
//     // limit: 10
//   });

//   res.json(results);
// });

module.exports = router;
