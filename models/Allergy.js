// models/Allergy.js
const { DataTypes } = require("sequelize");
const sequelize = require("./db");
const MedicalHistory = require("./MedicalHistory");

const Allergy = sequelize.define(
  "Allergy",
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
    tableName: "allergies",
    timestamps: true,
  }
);

//Relations
Allergy.associate = (models) => {
  Allergy.belongsTo(MedicalHistory, {
    foreignKey: "medical_history_id",
    onDelete: "CASCADE",
  });
};

module.exports = Allergy;
