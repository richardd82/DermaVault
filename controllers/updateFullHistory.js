module.exports = async (req, res) => {
    const { id } = req.params;
    const {
      clinical_data,
      allergies,
      general_history,
      diagnosis,
      evolutions
    } = req.body;
  
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
  
      if (evolutions && Array.isArray(evolutions)) {
        await EvolutionDate.destroy({ where: { medical_history_id: id } });
        await EvolutionDate.bulkCreate(
          evolutions.map(e => ({
            ...e,
            medical_history_id: id
          }))
        );
      }
  
      return res.json({ success: true, message: "Historia clínica actualizada" });
  
    } catch (err) {
      console.error("Error al actualizar historia:", err);
      return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
  };
  