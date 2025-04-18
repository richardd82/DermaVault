// controllers/searchExactHistories.js
const {
    MedicalHistory,
    Patient,
    ClinicalData,
    Allergy,
    GeneralMedicalHistory,
    Diagnosis,
    EvolutionDate,
    Sequelize
  } = require("../models");
  
  const { Op } = Sequelize;
  
  module.exports = async (req, res) => {
    try {
      const q = req.query.q?.trim().toLowerCase();
  
      if (!q) {
        return res.status(400).json({ success: false, message: "Consulta vacía" });
      }
  
      const isNumeric = /^\d+$/.test(q);
  
      // Si es número de 1 o 2 dígitos => buscar cédula exacta M-xx
      let whereClause;
  
      if (isNumeric && q.length <= 2) {
        whereClause = {
          "$Patient.cedula$": `M-${q}`
        };
      } else if (isNumeric && q.length > 2) {
        // Números largos: buscar por cédula que contenga
        whereClause = {
          "$Patient.cedula$": {
            [Op.like]: `%${q}%`
          }
        };
      } else if (!isNumeric && q.length >= 3) {
        whereClause = {
          [Op.or]: [
            { "$Patient.nombre$": { [Op.like]: `%${q}%` } },
            { "$Patient.apellido$": { [Op.like]: `%${q}%` } },
            { "$Diagnosis.diagnostico_principal$": { [Op.like]: `%${q}%` } },
            Sequelize.where(
              Sequelize.fn("LOWER", Sequelize.fn("CONCAT", Sequelize.col("Patient.nombre"), " ", Sequelize.col("Patient.apellido"))),
              { [Op.like]: `%${q}%` }
            ),
            Sequelize.where(
              Sequelize.fn("LOWER", Sequelize.fn("CONCAT", Sequelize.col("Patient.apellido"), " ", Sequelize.col("Patient.nombre"))),
              { [Op.like]: `%${q}%` }
            )
          ]
        };
      }
       else {
        return res.status(400).json({ success: false, message: "Consulta muy corta o inválida" });
      }
  
      const results = await MedicalHistory.findAll({
        where: whereClause,
        include: [
          {
            model: Patient,
            attributes: ["cedula", "nombre", "apellido", "email", "telefono_movil"]
          },
          { model: ClinicalData, as: "ClinicalData" },
          { model: Allergy },
          { model: GeneralMedicalHistory },
          { model: Diagnosis },
          { model: EvolutionDate }
        ],
        order: [["updatedAt", "DESC"]]
      });
  
      return res.json({
        success: true,
        data: results,
        total: results.length
      });
    } catch (err) {
      console.error("Error en búsqueda exacta:", err);
      return res.status(500).json({
        success: false,
        message: "Error interno en búsqueda exacta"
      });
    }
  };
  