// models/GeneralMedicalHistory.js
const { DataTypes } = require("sequelize");
const sequelize = require("./db");
const MedicalHistory = require("./MedicalHistory");

const GeneralMedicalHistory = sequelize.define(
  "GeneralMedicalHistory",
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
    tableName: "general_medical_history",
    timestamps: true,
  }
);

GeneralMedicalHistory.associate = (models) => {
  GeneralMedicalHistory.belongsTo(MedicalHistory, {
    foreignKey: "medical_history_id",
    onDelete: "CASCADE",
  });
};

module.exports = GeneralMedicalHistory;
