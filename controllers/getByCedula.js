const {
  MedicalHistory,
  ClinicalData,
  Allergy,
  GeneralMedicalHistory,
  Diagnosis,
  EvolutionDate,
  Patient
} = require("../models");

const { fn, col, where } = require("sequelize");

module.exports = async (req, res) => {
  const { cedula } = req.params;

  try {
    const history = await MedicalHistory.findOne({
      where: where(fn("LOWER", col("cedula")), cedula.toLowerCase()),
      include: [
        {
          model: Patient,
          attributes: ["cedula", "nombre", "apellido", "email", "telefono_movil"]
        },
        { model: ClinicalData, as: "ClinicalData" },
        { model: Allergy, as: "Allergy" },
        { model: GeneralMedicalHistory, as: "GeneralMedicalHistory" },
        { model: Diagnosis, as: "Diagnosis" },
        { model: EvolutionDate, as: "EvolutionDates" }
      ]
    });

    if (!history) {
      return res.status(404).json({ success: false, message: "Historia clínica no encontrada" });
    }

    return res.status(200).json(history);
  } catch (error) {
    console.error("Error al obtener historia clínica:", error);
    return res.status(500).json({ success: false, message: "Error del servidor" });
  }
};
