const db = require("../models");
const {
  MedicalHistory,
  Patient,
  ClinicalData,
  Allergy,
  GeneralMedicalHistory,
  Diagnosis,
  EvolutionDate
} = db;

  
  module.exports = async (req, res) => {
    try {
      const histories = await MedicalHistory.findAll({
        include: [
          {
            model: Patient,
            attributes: ["cedula", "nombre", "apellido", "email", "telefono_movil"]
          },
          {
            model: ClinicalData,
            as: "ClinicalData"
          },
          {
            model: Allergy
          },
          {
            model: GeneralMedicalHistory
          },
          {
            model: Diagnosis
          },
          {
            model: EvolutionDate,
            order: [["date", "DESC"]] // opcional: orden cronológico
          }
        ],
        order: [["updatedAt", "DESC"]] // las más recientes primero
      });
      // console.log("Primera historia clínica:", histories[0]?.toJSON());
      return res.status(200).json({
        success: true,
        data: histories
      });
  
    } catch (err) {
      console.error("Error al obtener historias clínicas:", err);
      return res.status(500).json({
        success: false,
        message: "Error al obtener las historias clínicas"
      });
    }
  };
  