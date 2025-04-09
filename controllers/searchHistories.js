const { Op, fn, col, where } = require("sequelize");
const { MedicalHistory, Patient, Diagnosis } = require("../models");

module.exports = async (req, res) => {
  const q = req.query.q
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // 🔥 quitar acentos

  if (!q || q.length < 2) {
    return res.json({ success: true, data: [] });
  }

  try {
    const histories = await MedicalHistory.findAll({
      include: [
        {
          model: Patient,
          where: {
            [Op.or]: [
              where(
                fn(
                  "LOWER",
                  fn(
                    "REPLACE",
                    fn(
                      "REPLACE",
                      fn("REPLACE", col("Patient.nombre"), "á", "a"),
                      "é",
                      "e"
                    ),
                    "í",
                    "i"
                  )
                ),
                {
                  [Op.like]: `%${q}%`,
                }
              ),
              where(
                fn(
                  "LOWER",
                  fn(
                    "REPLACE",
                    fn(
                      "REPLACE",
                      fn("REPLACE", col("Patient.apellido"), "á", "a"),
                      "é",
                      "e"
                    ),
                    "í",
                    "i"
                  )
                ),
                {
                  [Op.like]: `%${q}%`,
                }
              ),
              where(fn("LOWER", col("Patient.cedula")), {
                [Op.like]: `%${q}%`,
              }),
            ],
          },
        },
        {
          model: Diagnosis,
          where: where(
            fn(
              "LOWER",
              fn(
                "REPLACE",
                fn(
                  "REPLACE",
                  fn(
                    "REPLACE",
                    col("Diagnosis.diagnostico_principal"),
                    "á",
                    "a"
                  ),
                  "é",
                  "e"
                ),
                "í",
                "i"
              )
            ),
            {
              [Op.like]: `%${q}%`,
            }
          ),
          required: false,
        },
      ],
      limit: 50,
    });

    return res.json({ success: true, data: histories });
  } catch (error) {
    console.error("Error en búsqueda:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};

// const { Op, fn, col, where } = require("sequelize");
// const MedicalHistory = require("../models/MedicalHistory");
// const Patient = require("../models/Patient");
// const Diagnosis = require("../models/Diagnosis.js");
// const sequelize = require("../models").sequelize;

// module.exports = async (req, res) => {
//   const { q } = req.query;

//   if (!q || q.trim().length < 2) {
//     return res.json({ success: true, data: [] });
//   }

//   try {
//     const histories = await MedicalHistory.findAll({
//       include: [
//         {
//           model: Patient,
//           where: {
//             [Op.or]: [
//               where(fn("LOWER", col("Patient.nombre")), {
//                 [Op.like]: `%${q.toLowerCase()}%`,
//               }),
//               where(fn("LOWER", col("Patient.apellido")), {
//                 [Op.like]: `%${q.toLowerCase()}%`,
//               }),
//               where(fn("LOWER", col("Patient.cedula")), {
//                 [Op.like]: `%${q.toLowerCase()}%`,
//               }),
//             ],
//           },
//         },
//         {
//           model: Diagnosis,
//           where: sequelize.where(
//             sequelize.fn(
//               "CONVERT",
//               sequelize.col("Diagnosis.diagnostico_principal"),
//               sequelize.literal(
//                 "CHAR CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
//               )
//             ),
//             {
//               [Op.like]: `%${q}%`,
//             }
//           ),
//           required: false,
//         },
//       ],
//     });

//     return res.json({ success: true, data: histories });
//   } catch (err) {
//     console.error("Error en búsqueda:", err);
//     return res
//       .status(500)
//       .json({ success: false, message: "Error interno del servidor" });
//   }
// };
