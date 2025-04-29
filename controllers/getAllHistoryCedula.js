// controllers/getAllHistoryCedulas.js
const { MedicalHistory } = require("../models");

const getAllHistoryCedulas = async (req, res) => {
  try {
    const histories = await MedicalHistory.findAll({
      attributes: ["cedula", "patient_id"]
    });

    res.status(200).json({
      success: true,
      data: histories,
    });
  } catch (error) {
    console.error("Error al obtener cédulas de historias clínicas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener cédulas",
    });
  }
};

module.exports = getAllHistoryCedulas;
