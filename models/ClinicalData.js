// models/ClinicalData.js
const { DataTypes } = require("sequelize");
const sequelize = require("./db");
const MedicalHistory = require("./MedicalHistory");

const ClinicalData = sequelize.define(
  "ClinicalData",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    medical_history_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    question: { type: DataTypes.STRING(255), allowNull: false },
    answer: { type: DataTypes.TEXT },
  },
  {
    tableName: "clinical_data",
    timestamps: true,
  }
);

//Relations
ClinicalData.associate = (models) => {
  ClinicalData.belongsTo(MedicalHistory, {
    foreignKey: "medical_history_id",
    onDelete: "CASCADE",
  });
};

module.exports = ClinicalData;
