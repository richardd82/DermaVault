module.exports = async (req, res) => {
    const { cedula } = req.params;
  
    try {
      const history = await MedicalHistory.findOne({
        where: { cedula },
        include: [
          ClinicalData,
          Allergy,
          GeneralMedicalHistory,
          Diagnosis,
          EvolutionDate
        ]
      });
  
      if (!history) {
        return res.status(404).json({ success: false, message: "Historia clínica no encontrada" });
      }
  
      return res.json({ success: true, data: history });
  
    } catch (err) {
      console.error("Error al obtener historia clínica:", err);
      return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
  };
  