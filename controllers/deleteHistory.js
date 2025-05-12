const {
  MedicalHistory
} = require("../models");
module.exports = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deleted = await MedicalHistory.destroy({ where: { id } });
      if (!deleted) return res.status(404).json({ success: false, message: "Historia no encontrada" });
  
      return res.json({ success: true, message: "Historia clínica eliminada" });
    } catch (err) {
      console.error("Error al eliminar historia:", err);
      return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
  };
  