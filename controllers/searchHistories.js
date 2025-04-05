const { Op } = require("sequelize");

module.exports = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return res.json({ success: true, data: [] });
  }

  try {
    const histories = await MedicalHistory.findAll({
      include: [
        {
          model: Patient,
          where: {
            [Op.or]: [
              { nombre: { [Op.like]: `%${q}%` } },
              { apellido: { [Op.like]: `%${q}%` } },
              { cedula: { [Op.like]: `%${q}%` } }
            ]
          }
        },
        {
          model: ClinicalData,
          where: {
            padecimiento_actual: { [Op.like]: `%${q}%` }
          },
          required: false
        }
      ],
      limit: 10
    });

    return res.json({ success: true, data: histories });
  } catch (err) {
    console.error("Error en búsqueda:", err);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};
