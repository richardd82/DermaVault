const express = require("express");
const router = express.Router();
const moment = require("moment");
const { Patient } = require("../models"); // ajusta según tu estructura
const auth = require("../middleware/auth"); // tu middleware de auth

// Divide el array en chunks de 25
function chunkArray(array, size) {
  return array.reduce((chunks, item, index) => {
    const chunkIndex = Math.floor(index / size);
    if (!chunks[chunkIndex]) chunks[chunkIndex] = [];
    chunks[chunkIndex].push(item);
    return chunks;
  }, []);
}

router.post("/", auth, async (req, res) => {
  try {
    const patientsArray = req.body;

    // Validación base: que sea un array
    if (!Array.isArray(patientsArray)) {
      return res.status(400).json({ message: "Debe enviar un arreglo de pacientes" });
    }

    const chunks = chunkArray(patientsArray, 25);
    const insertedPatients = [];

    for (const chunk of chunks) {
      // Formateo de cada grupo de 25
      const formattedPatients = chunk.map((patient) => {
        const parsedDate = moment(patient.fecha_nacimiento, "DD/MM/YYYY", true);
        const fechaNacimientoFormatted = parsedDate.isValid()
          ? parsedDate.format("YYYY-MM-DD")
          : null;

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

      // Verifica duplicados por cédula
      const existingCedulas = await Patient.findAll({
        where: {
          cedula: formattedPatients.map((p) => p.cedula),
        },
        attributes: ["cedula"],
      });

      const existingCedulaSet = new Set(existingCedulas.map((p) => p.cedula));
      const nonDuplicatePatients = formattedPatients.filter(
        (p) => !existingCedulaSet.has(p.cedula)
      );

      if (nonDuplicatePatients.length > 0) {
        const inserted = await Patient.bulkCreate(nonDuplicatePatients);
        insertedPatients.push(...inserted);
      }
    }

    res.status(201).json({
      message: `Se insertaron ${insertedPatients.length} pacientes.`,
      data: insertedPatients,
    });
  } catch (error) {
    console.error("Error al insertar pacientes en chunks:", error);
    res.status(500).json({ message: "Error al insertar pacientes en segmentos" });
  }
});
module.exports = router;