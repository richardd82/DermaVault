const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const GeneralMedicalHistory = sequelize.define("GeneralMedicalHistory", {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  medical_history_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  topografia: DataTypes.TEXT,
  morfologia: DataTypes.TEXT,
  resto_piel_anexos: DataTypes.TEXT
}, {
  tableName: "general_medical_history",
  timestamps: true,
});

GeneralMedicalHistory.associate = (models) => {
  GeneralMedicalHistory.belongsTo(models.MedicalHistory, {
    foreignKey: "medical_history_id",
    onDelete: "CASCADE"
  });
};

module.exports = GeneralMedicalHistory;
