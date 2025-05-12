const {
  MedicalHistory,
  ClinicalData,
  Allergy,
  GeneralMedicalHistory,
  Diagnosis,
  EvolutionDate,
  Patient,
} = require("../models");

module.exports = async (req, res) => {
  const {
    cedula,
    clinical_data,
    allergies,
    general_history,
    diagnosis,
    EvolutionDates ,
  } = req.body;

  try {
    // Validar que exista el paciente
    const patient = await Patient.findOne({ where: { cedula } });
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Paciente no encontrado" });
    }

    // Validar que la historia clínica no exista
    const existingHistory = await MedicalHistory.findOne({ where: { cedula } });
      if (existingHistory) {
        return res.status(409).json({
          success: false,
          message: "Ya existe una historia clínica para este paciente",
      });
    }
      // Crear la historia clínica
      const medicalHistory = await MedicalHistory.create({
        patient_id: patient.id,
        cedula: patient.cedula,
      });
    
    // Crear cada sección si viene en el body
    if (clinical_data) {
      await ClinicalData.create({
        ...clinical_data,
        medical_history_id: medicalHistory.id,
      });
    }

    if (allergies) {
      await Allergy.create({
        ...allergies,
        medical_history_id: medicalHistory.id,
      });
    }

    if (general_history) {
      await GeneralMedicalHistory.create({
        ...general_history,
        medical_history_id: medicalHistory.id,
      });
    }

    if (diagnosis) {
      await Diagnosis.create({
        ...diagnosis,
        medical_history_id: medicalHistory.id,
      });
    }

    if (Array.isArray(EvolutionDates ) && EvolutionDates .length > 0) {
      const nuevasEvoluciones = EvolutionDates
        .filter(e => e.date && typeof e.observation === "string")
        .map(e => ({
          ...e,
          medical_history_id: medicalHistory.id,
        }));
    
      if (nuevasEvoluciones.length > 0) {
        await EvolutionDate.bulkCreate(nuevasEvoluciones);
      }
    }  

    return res.status(201).json({
      success: true,
      message: "Historia clínica registrada correctamente",
      medical_history_id: medicalHistory.id,
    });
  } catch (err) {
    console.error("Error al crear historia clínica:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};
