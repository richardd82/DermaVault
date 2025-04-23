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
  // console.log("📩 PUT recibido en /histories/:id");

    const { id } = req.params;
    const {
      clinical_data,
      allergies,
      general_history,
      diagnosis,
      EvolutionDates
    } = req.body;
  // console.log(req, "req.body.EvolutionDates")
    try {
      const history = await MedicalHistory.findByPk(id);
      if (!history) return res.status(404).json({ success: false, message: "Historia no encontrada" });
  
      if (clinical_data) {
        await ClinicalData.update(clinical_data, { where: { medical_history_id: id } });
      }
  
      if (allergies) {
        await Allergy.update(allergies, { where: { medical_history_id: id } });
      }
  
      if (general_history) {
        await GeneralMedicalHistory.update(general_history, { where: { medical_history_id: id } });
      }
  
      if (diagnosis) {
        await Diagnosis.update(diagnosis, { where: { medical_history_id: id } });
      }
  
      if (Array.isArray(EvolutionDates)) {
        const historyId = parseInt(req.params.id); // Aseguramos que sea número
      
        // console.log("🧾 EvolutionDates recibidas:", EvolutionDates);
      
        const existing = EvolutionDates.filter((e) => e.id); // Tienen ID, deben actualizarse
        const newOnes = EvolutionDates.filter(
          (e) =>
            (!e.id || e.id === null || e.id === "") &&
            typeof e.date === "string" &&
            e.date.trim() !== "" &&
            typeof e.observation === "string"
        );
      
        // 🔄 Actualizar evoluciones existentes
        // console.log(existing, "existing evolutions");
        for (const evo of existing) {
          const [affectedRows] = await EvolutionDate.update(
            {
              date: evo.date,
              observation: evo.observation,
            },
            {
              where: {
                id: evo.id,
                medical_history_id: historyId, // Más específico
              },
            }
          );
      
          // console.log(`🔄 ID ${evo.id}: ${affectedRows} fila(s) actualizada(s)`);
        }
      
        // ➕ Insertar nuevas evoluciones
        if (newOnes.length > 0) {
          const formatted = newOnes.map((e) => ({
            ...e,
            medical_history_id: historyId,
          }));
      
          // console.log("🚀 Insertando nuevas evoluciones:", formatted);
      
          await EvolutionDate.bulkCreate(formatted);
        }
      }
      
      const updatedHistory = await MedicalHistory.findOne({
        where: { id },
        include: [
          { model: Patient, attributes: ["cedula", "nombre", "apellido", "email", "telefono_movil"] },
          { model: ClinicalData, as: "ClinicalData" },
          { model: Allergy },
          { model: GeneralMedicalHistory },
          { model: Diagnosis },
          { model: EvolutionDate, as: "EvolutionDates", order: [['date', 'DESC']], }
        ],
      });
      
      return res.json({
        success: true,
        message: "Historia clínica actualizada",
        updatedHistory, // 👈 esto se usa en el frontend
      });
      
      
      // return res.json({ success: true, message: "Historia clínica actualizada" });
  
    } catch (err) {
      console.error("Error al actualizar historia:", err);
      return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
  };
  