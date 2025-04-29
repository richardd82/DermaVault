const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const ClinicalData = sequelize.define("ClinicalData", {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  medical_history_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  padecimiento_actual: DataTypes.TEXT,
  antecedentes_heredofamiliares: DataTypes.TEXT,
  antecedentes_personales: DataTypes.TEXT,
  resto_aparatos_sistemas: DataTypes.TEXT,
  cicatrices_queloides: DataTypes.TEXT,
  tension_arterial: DataTypes.TEXT,
  sangrado_hematomas: DataTypes.TEXT,
  ciclo_menstrual: DataTypes.TEXT,
  tabaquismo: DataTypes.TEXT,
  alcoholismo: DataTypes.TEXT,
  problemas_emocionales: DataTypes.TEXT
}, {
  tableName: "clinical_data",
  timestamps: true,
});

ClinicalData.associate = (models) => {
  ClinicalData.belongsTo(models.MedicalHistory, {
    foreignKey: "medical_history_id",
    onDelete: "CASCADE"
  });
};

module.exports = ClinicalData;
