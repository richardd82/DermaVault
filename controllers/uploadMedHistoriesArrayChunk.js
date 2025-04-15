const {
    MedicalHistory,
    Patient,
    ClinicalData,
    Allergy,
    GeneralMedicalHistory,
    Diagnosis,
    EvolutionDate
  } = require("../models");
  
  function chunkArray(array, size) {
    console.log("Ejemplo de historia recibida:", JSON.stringify(historiesArray[0], null, 2));
    return array.reduce((chunks, item, index) => {
      const chunkIndex = Math.floor(index / size);
      if (!chunks[chunkIndex]) chunks[chunkIndex] = [];
      chunks[chunkIndex].push(item);
      return chunks;
    }, []);
  }
  
  const uploadMedHistoriesArrayChunk = async (req, res) => {
    try {
      const historiesArray = req.body;
      if (!Array.isArray(historiesArray)) {
        return res.status(400).json({ message: "Debe enviar un arreglo de historias clínicas" });
      }
  
      const chunks = chunkArray(historiesArray, 25);
      const insertedHistories = [];
      const skipped = [];
  
      for (const chunk of chunks) {
        for (const history of chunk) {
          const cleaned = Object.fromEntries(
            Object.entries(history).map(([key, value]) => [
              key,
              value === "Vacío" ? null : value,
            ])
          );
  
          const cedula = (cleaned.cedula || "").toUpperCase();
  
          // Buscar paciente por cédula
          const paciente = await Patient.findOne({ where: { cedula } });
          if (!paciente) {
            skipped.push({ cedula, reason: "Paciente no encontrado" });
            continue;
          }
  
          // Verificar duplicado
          const existing = await MedicalHistory.findOne({ where: { cedula } });
          if (existing) {
            skipped.push({ cedula, reason: "Historia clínica ya existe" });
            continue;
          }
  
          // Separar las secciones
          const {
            clinical_data,
            allergies,
            general_history,
            diagnosis,
            evolutions,
            ...core
          } = cleaned;
  
          // Insertar historia clínica principal
          const newHistory = await MedicalHistory.create({
            ...core,
            cedula,
            patient_id: paciente.id,
          });
  
          // Insertar subcomponentes si existen
          if (clinical_data) {
            await ClinicalData.create({
              ...clinical_data,
              medical_history_id: newHistory.id,
            });
          }
  
          if (allergies) {
            await Allergy.create({
              ...allergies,
              medical_history_id: newHistory.id,
            });
          }
  
          if (general_history) {
            await GeneralMedicalHistory.create({
              ...general_history,
              medical_history_id: newHistory.id,
            });
          }
  
          if (diagnosis) {
            await Diagnosis.create({
              ...diagnosis,
              medical_history_id: newHistory.id,
            });
          }
  
          if (evolutions && Array.isArray(evolutions)) {
            const evolucionesFormateadas = evolutions.map((ev) => ({
              ...ev,
              medical_history_id: newHistory.id,
            }));
            await EvolutionDate.bulkCreate(evolucionesFormateadas);
          }
  
          insertedHistories.push({
            cedula: newHistory.cedula,
            patient_id: newHistory.patient_id,
            id: newHistory.id,
          });
        }
      }
  
      res.status(201).json({
        message: `Se insertaron ${insertedHistories.length} historias clínicas.`,
        data: insertedHistories,
        omitidos: skipped,
      });
    } catch (error) {
      console.error("Error al insertar historias clínicas:", error);
      res.status(500).json({ message: "Error al insertar historias clínicas" });
    }
  };
  
  module.exports = uploadMedHistoriesArrayChunk;
  
// const { MedicalHistory } = require("../models");

// function chunkArray(array, size) {
//   return array.reduce((chunks, item, index) => {
//     const chunkIndex = Math.floor(index / size);
//     if (!chunks[chunkIndex]) chunks[chunkIndex] = [];
//     chunks[chunkIndex].push(item);
//     return chunks;
//   }, []);
// }

// const uploadMedHistoriesArrayChunk = async (req, res) => {
//   try {
//     const historiesArray = req.body;

//     if (!Array.isArray(historiesArray)) {
//       return res.status(400).json({ message: "Debe enviar un arreglo de historias clínicas" });
//     }

//     const chunks = chunkArray(historiesArray, 25);
//     const insertedHistories = [];

//     for (const chunk of chunks) {
//       const formattedHistories = chunk.map((history) => {
//         const cleaned = Object.fromEntries(
//           Object.entries(history).map(([key, value]) => [
//             key,
//             value === "Vacío" ? null : value,
//           ])
//         );

//         if (cleaned.cedula) {
//           cleaned.cedula = cleaned.cedula.toUpperCase();
//         }

//         return cleaned;
//       });

//       const existing = await MedicalHistory.findAll({
//         where: {
//           cedula: formattedHistories.map((h) => h.cedula),
//         },
//         attributes: ["cedula"],
//       });

//       const existingCedulaSet = new Set(existing.map((h) => h.cedula));
//       const nonDuplicates = formattedHistories.filter(
//         (h) => !existingCedulaSet.has(h.cedula)
//       );

//       if (nonDuplicates.length > 0) {
//         const inserted = await MedicalHistory.bulkCreate(nonDuplicates, {
//             include: [
//               "clinical_data",
//               "allergies",
//               "general_history",
//               "diagnosis",
//               "evolutions",
//             ]
//           });
//         insertedHistories.push(...inserted);
//       }
//     }

//     res.status(201).json({
//       message: `Se insertaron ${insertedHistories.length} historias clínicas.`,
//       data: insertedHistories,
//     });
//   } catch (error) {
//     console.error("Error al insertar historias clínicas:", error);
//     res.status(500).json({ message: "Error al insertar historias clínicas" });
//   }
// };

// module.exports = uploadMedHistoriesArrayChunk;
