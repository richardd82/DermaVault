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
  console.log(res, "<=====================");
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const offset = req.query.offset ? parseInt(req.query.offset) : null;
    const q = req.query.q?.trim().toLowerCase() || "";

    if (limit === null || offset === null || isNaN(limit) || isNaN(offset)) {
      return res.status(400).json({
        success: false,
        message: "Parámetros 'limit' y 'offset' requeridos y válidos"
      });
    }

    // const MAX_LIMIT = 1000;
    // if (limit > MAX_LIMIT) {
    //   return res.status(400).json({
    //     success: false,
    //     message: `Límite máximo permitido: ${MAX_LIMIT}`
    //   });
    // }

    let patientSearch;
    let diagnosisSearch;

    if (!q) {
      patientWhere = undefined; // Carga todo sin filtro
      diagnosisWhere = undefined;
    } else if (isNumeric && q.length <= 2) {
      // Buscar por cédula exacta
      patientWhere = { cedula: { [Op.eq]: `M-${q}` } };
    } else if (isNumeric || q.length >= 3) {
      // Búsqueda por texto o cédula larga
      patientWhere = {
        [Op.or]: [
          { nombre: { [Op.like]: `%${q}%` } },
          { apellido: { [Op.like]: `%${q}%` } },
          { cedula: { [Op.like]: `%${q}%` } },
        ],
      };
    
      diagnosisWhere = {
        diagnostico_principal: { [Op.like]: `%${q}%` },
      };
    }
    
    const { count, rows } = await MedicalHistory.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: Patient,
          attributes: ["cedula", "nombre", "apellido", "email", "telefono_movil"],
          where: patientWhere, // dinámico
        },
        { model: ClinicalData, as: "ClinicalData" },
        { model: Allergy },
        { model: GeneralMedicalHistory },
        {
          model: Diagnosis,
          where: diagnosisWhere, // puede ser undefined
          required: false,
        },
        {
          model: EvolutionDate,
          order: [["date", "DESC"]],
        },
      ],
      order: [["updatedAt", "DESC"]],
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


// const {
//   MedicalHistory,
//   Patient,
//   ClinicalData,
//   Allergy,
//   GeneralMedicalHistory,
//   Diagnosis,
//   EvolutionDate,
//   Sequelize,
// } = require("../models");

// const { Op, fn, col, where } = Sequelize;

// module.exports = async (req, res) => {
//   try {
//     const limit = req.query.limit ? parseInt(req.query.limit) : null;
//     const offset = req.query.offset ? parseInt(req.query.offset) : null;
//     const q = req.query.q
//       ?.toLowerCase()
//       .normalize("NFD")
//       .replace(/[\u0300-\u036f]/g, ""); // quitar acentos

//     const isNumeric = /^\d+$/.test(q);
//     const formattedCedula = isNumeric && q.length <= 2 ? `M-${q}` : q;

//     // Si la búsqueda es por nombre/apellido/diagnóstico y tiene menos de 3 caracteres, rechazar
//     if (!isNumeric && q?.length < 3) {
//       return res.status(400).json({
//         success: false,
//         message: "Consulta muy corta para nombre, apellido o diagnóstico",
//       });
//     }

//     const patientSearch = q
//       ? {
//           [Op.or]: [
//             where(
//               fn(
//                 "LOWER",
//                 fn(
//                   "REPLACE",
//                   fn(
//                     "REPLACE",
//                     fn("REPLACE", col("Patient.nombre"), "á", "a"),
//                     "é",
//                     "e"
//                   ),
//                   "í",
//                   "i"
//                 )
//               ),
//               { [Op.like]: `%${q}%` }
//             ),
//             where(
//               fn(
//                 "LOWER",
//                 fn(
//                   "REPLACE",
//                   fn(
//                     "REPLACE",
//                     fn("REPLACE", col("Patient.apellido"), "á", "a"),
//                     "é",
//                     "e"
//                   ),
//                   "í",
//                   "i"
//                 )
//               ),
//               { [Op.like]: `%${q}%` }
//             ),
//             where(fn("LOWER", col("Patient.cedula")), {
//               [Op.like]:
//                 isNumeric && q.length <= 2
//                   ? formattedCedula
//                   : `%${formattedCedula}%`,
//             }),
//           ],
//         }
//       : undefined;

//     const diagnosisSearch = q
//       ? {
//           [Op.or]: [
//             where(
//               fn(
//                 "LOWER",
//                 fn(
//                   "REPLACE",
//                   fn(
//                     "REPLACE",
//                     fn(
//                       "REPLACE",
//                       col("Diagnosis.diagnostico_principal"),
//                       "á",
//                       "a"
//                     ),
//                     "é",
//                     "e"
//                   ),
//                   "í",
//                   "i"
//                 )
//               ),
//               { [Op.like]: `%${q}%` }
//             ),
//           ],
//         }
//       : undefined;

//     const { count, rows } = await MedicalHistory.findAndCountAll({
//       limit,
//       offset,
//       include: [
//         {
//           model: Patient,
//           attributes: [
//             "cedula",
//             "nombre",
//             "apellido",
//             "email",
//             "telefono_movil",
//           ],
//           where: patientSearch,
//         },
//         { model: ClinicalData, as: "ClinicalData" },
//         { model: Allergy },
//         { model: GeneralMedicalHistory },
//         {
//           model: Diagnosis,
//           where: diagnosisSearch,
//           required: false,
//         },
//         {
//           model: EvolutionDate,
//           order: [["date", "DESC"]],
//         },
//       ],
//       order: [["updatedAt", "DESC"]],
//     });

//     return res.status(200).json({
//       success: true,
//       data: rows,
//       total: count,
//       hasMore: offset + limit < count,
//     });
//   } catch (err) {
//     console.error("Error al obtener historias clínicas:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Error al obtener las historias clínicas",
//     });
//   }
// };
