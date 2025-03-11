// models/EvolutionDate.js
const { DataTypes } = require("sequelize");
const sequelize = require("./db");
const MedicalHistory = require("./MedicalHistory");

const EvolutionDate = sequelize.define(
  "EvolutionDate",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    medical_history_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    observation: { type: DataTypes.TEXT },
  },
  {
    tableName: "evolution_dates",
    timestamps: true,
  }
);

//Relations
EvolutionDate.associate = (models) => {
  EvolutionDate.belongsTo(MedicalHistory, {
    foreignKey: "medical_history_id",
    onDelete: "CASCADE",
  });
};

module.exports = EvolutionDate;
