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

module.exports = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const offset = req.query.offset ? parseInt(req.query.offset) : null;

    // Validación de parámetros
    if (limit === null || offset === null || isNaN(limit) || isNaN(offset)) {
      return res.status(400).json({
        success: false,
        message: "Parámetros 'limit' y 'offset' requeridos y válidos"
      });
    }

    const MAX_LIMIT = 1000;
    if (limit > MAX_LIMIT) {
      return res.status(400).json({
        success: false,
        message: `Límite máximo permitido: ${MAX_LIMIT}`
      });
    }

    // Obtener datos con asociaciones
    const { count, rows } = await MedicalHistory.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: Patient,
          attributes: ["cedula", "nombre", "apellido", "email", "telefono_movil"]
        },
        { model: ClinicalData, as: "ClinicalData" },
        { model: Allergy },
        { model: GeneralMedicalHistory },
        { model: Diagnosis },
        {
          model: EvolutionDate,
          order: [["date", "DESC"]]
        }
      ],
      order: [["updatedAt", "DESC"]]
    });

    return res.status(200).json({
      success: true,
      data: rows,
      total: count,
      hasMore: offset + limit < count
    });

  } catch (err) {
    console.error("Error al obtener historias clínicas:", err);
    return res.status(500).json({
      success: false,
      message: "Error al obtener las historias clínicas"
    });
  }
};

// const db = require("../models");
// const {
//   MedicalHistory,
//   Patient,
//   ClinicalData,
//   Allergy,
//   GeneralMedicalHistory,
//   Diagnosis,
//   EvolutionDate
// } = db;

  
//   module.exports = async (req, res) => {
//     try {
//       const histories = await MedicalHistory.findAll({
//         include: [
//           {
//             model: Patient,
//             attributes: ["cedula", "nombre", "apellido", "email", "telefono_movil"]
//           },
//           {
//             model: ClinicalData,
//             as: "ClinicalData"
//           },
//           {
//             model: Allergy
//           },
//           {
//             model: GeneralMedicalHistory
//           },
//           {
//             model: Diagnosis
//           },
//           {
//             model: EvolutionDate,
//             order: [["date", "DESC"]] // opcional: orden cronológico
//           }
//         ],
//         order: [["updatedAt", "DESC"]] // las más recientes primero
//       });
//       // console.log("Primera historia clínica:", histories[0]?.toJSON());
//       return res.status(200).json({
//         success: true,
//         data: histories
//       });
  
//     } catch (err) {
//       console.error("Error al obtener historias clínicas:", err);
//       return res.status(500).json({
//         success: false,
//         message: "Error al obtener las historias clínicas"
//       });
//     }
//   };
  