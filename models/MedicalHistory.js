// models/MedicalHistory.js
const { DataTypes } = require("sequelize");
const sequelize = require("./db");
const Patient = require("./Patient");

const MedicalHistory = sequelize.define(
  "MedicalHistory",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    patient_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  {
    tableName: "medical_histories",
    timestamps: true,
  }
);

//Relations
MedicalHistory.associate = (models) => {
  MedicalHistory.belongsTo(Patient, {
    foreignKey: "patient_id",
    onDelete: "CASCADE",
  });
  MedicalHistory.hasMany(require("./ClinicalData"), {
    foreignKey: "medical_history_id",
    onDelete: "CASCADE",
  });
  MedicalHistory.hasMany(require("./Allergy"), {
    foreignKey: "medical_history_id",
    onDelete: "CASCADE",
  });
  MedicalHistory.hasMany(require("./GeneralMedicalHistory"), {
    foreignKey: "medical_history_id",
    onDelete: "CASCADE",
  });
  MedicalHistory.hasMany(require("./EvolutionDate"), {
    foreignKey: "medical_history_id",
    onDelete: "CASCADE",
  });
};

module.exports = MedicalHistory;
