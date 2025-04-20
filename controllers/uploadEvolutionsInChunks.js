const fs = require("fs");
const path = require("path");
const {
  Patient,
  MedicalHistory,
  EvolutionDate,
} = require("../models");

function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

module.exports = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../seeders/cedula_fechas_evolucion.json");
    const rawData = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(rawData);

    const allEvolutions = [];
    const errores = [];

    for (const item of data) {
      const cedula = item.cedula;
      const observations = item.observation;

      const patient = await Patient.findOne({ where: { cedula } });
      if (!patient) {
        errores.push({ cedula, error: "Paciente no encontrado" });
        continue;
      }

      const history = await MedicalHistory.findOne({ where: { cedula } });
      if (!history) {
        errores.push({ cedula, error: "Historia clínica no encontrada" });
        continue;
      }

      const evolutions = Object.entries(observations).map(([key, val]) => ({
        date: new Date(), // Puedes ajustar esta fecha si es necesario
        observation: `${key}: ${val}`,
        medical_history_id: history.id,
      }));

      allEvolutions.push(...evolutions);
    }

    const chunks = chunkArray(allEvolutions, 25);
    let totalInsertados = 0;

    for (const chunk of chunks) {
      await EvolutionDate.bulkCreate(chunk);
      totalInsertados += chunk.length;
    }

    res.json({
      success: true,
      totalInsertados,
      bloques: chunks.length,
      errores,
    });
  } catch (err) {
    console.error("❌ Error al subir evoluciones en chunks:", err);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};
