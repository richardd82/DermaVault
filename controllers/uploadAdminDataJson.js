const fs = require("fs");
const path = require("path");
const { Patient, AdministrativeData } = require("../models");

module.exports = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../seeders/cedula_datos_administrativos.json");
    const rawData = fs.readFileSync(filePath, "utf8");
    const records = JSON.parse(rawData);

    if (!Array.isArray(records)) {
      return res.status(400).json({ success: false, message: "El JSON debe contener un array." });
    }

    let inserted = 0;
    const errors = [];

    for (const record of records) {
      const { cedula, administrativedata } = record;
      try {
        const patient = await Patient.findOne({ where: { cedula } });

        if (!patient) {
          errors.push(`Paciente con cédula ${cedula} no encontrado.`);
          continue;
        }

        await AdministrativeData.create({
          patient_id: patient.id,
          no_cheque: administrativedata["no_cheque."] || null,
          no_recibo: administrativedata["no_recibo."] || null,
          rfc: administrativedata["rfc"] || null,
          cortesia: administrativedata["cortesia"] || false,
        });

        inserted++;
      } catch (e) {
        errors.push(`Error al procesar cédula ${cedula}: ${e.message}`);
      }
    }

    res.json({
      success: true,
      inserted,
      errores: errors,
    });
  } catch (error) {
    console.error("Error general al subir datos administrativos:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};
