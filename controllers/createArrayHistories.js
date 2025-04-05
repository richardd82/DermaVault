const {
    MedicalHistory,
    ClinicalData,
    Allergy,
    GeneralMedicalHistory,
    Diagnosis,
    EvolutionDate,
    Patient
  } = require("../models");
  
  module.exports = async (req, res) => {
    const histories = req.body;
  
    if (!Array.isArray(histories)) {
      return res.status(400).json({ success: false, message: "Se espera un array de historias clínicas" });
    }
  
    const results = [];
  
    for (const entry of histories) {
      const {
        cedula,
        clinical_data,
        allergies,
        general_history,
        diagnosis,
        evolutions
      } = entry;
  
      try {
        const patient = await Patient.findOne({ where: { cedula } });
        if (!patient) {
          results.push({ cedula, success: false, error: "Paciente no encontrado" });
          continue;
        }
  
        const medicalHistory = await MedicalHistory.create({ cedula });
  
        if (clinical_data) {
          await ClinicalData.create({ ...clinical_data, medical_history_id: medicalHistory.id });
        }
  
        if (allergies) {
          await Allergy.create({ ...allergies, medical_history_id: medicalHistory.id });
        }
  
        if (general_history) {
          await GeneralMedicalHistory.create({ ...general_history, medical_history_id: medicalHistory.id });
        }
  
        if (diagnosis) {
          await Diagnosis.create({ ...diagnosis, medical_history_id: medicalHistory.id });
        }
  
        if (evolutions && evolutions.length > 0) {
          const prepared = evolutions.map(e => ({
            ...e,
            medical_history_id: medicalHistory.id
          }));
          await EvolutionDate.bulkCreate(prepared);
        }
  
        results.push({ cedula, success: true, medical_history_id: medicalHistory.id });
  
      } catch (err) {
        console.error(`Error con paciente ${cedula}:`, err);
        results.push({ cedula, success: false, error: "Error al crear historia clínica" });
      }
    }
  
    return res.status(207).json({
      success: true,
      message: "Proceso completado",
      results
    });
  };
  