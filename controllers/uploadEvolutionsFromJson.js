// controllers/uploadEvolutionsFromJson.js
const fs = require("fs");
const path = require("path");
const {
  Patient,
  MedicalHistory,
  EvolutionDate,
} = require("../models");

module.exports = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../seeders/cedula_fechas_evolucion.json");
    const rawData = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(rawData);

    let insertados = 0;
    let errores = [];

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

      const evolutionsArray = Object.entries(observations).map(([label, text]) => ({
        date: new Date(), // puedes cambiar esto si deseas una lógica de fecha más precisa
        observation: `${label}: ${text}`,
        medical_history_id: history.id,
      }));

      await EvolutionDate.bulkCreate(evolutionsArray);
      insertados += evolutionsArray.length;
    }

    return res.json({
      success: true,
      insertados,
      errores,
    });
  } catch (err) {
    console.error("❌ Error al cargar evoluciones desde JSON:", err);
    return res.status(500).json({
      success: false,
      message: "Error interno al procesar el archivo",
    });
  }
};
