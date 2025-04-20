const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { AdministrativeData, Patient } = require("../models");

// 🔍 Obtener datos administrativos por patient_id
router.get("/:patientId", auth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const data = await AdministrativeData.findOne({
      where: { patient_id: patientId },
    });

    if (!data) return res.status(404).json({ success: false, message: "No existen datos administrativos." });

    return res.json({ success: true, data });
  } catch (error) {
    console.error("Error al obtener datos administrativos:", error);
    res.status(500).json({ success: false, message: "Error del servidor." });
  }
});

// 💾 Crear o actualizar datos administrativos
router.post("/:patientId", auth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { no_cheque, no_recibo, rfc, cortesia } = req.body;

    const patientExists = await Patient.findByPk(patientId);
    if (!patientExists) {
      return res.status(404).json({ success: false, message: "Paciente no encontrado." });
    }

    const existingData = await AdministrativeData.findOne({
      where: { patient_id: patientId },
    });

    if (existingData) {
      // Update
      await existingData.update({ no_cheque, no_recibo, rfc, cortesia });
      return res.json({ success: true, message: "Datos actualizados", data: existingData });
    } else {
      // Create
      const newData = await AdministrativeData.create({
        patient_id: patientId,
        no_cheque,
        no_recibo,
        rfc,
        cortesia,
      });
      return res.status(201).json({ success: true, message: "Datos creados", data: newData });
    }
  } catch (error) {
    console.error("Error al guardar datos administrativos:", error);
    res.status(500).json({ success: false, message: "Error del servidor." });
  }
});

module.exports = router;
