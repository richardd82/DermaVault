const { DataTypes } = require("sequelize");
const sequelize = require("./db");
const Patient = require("./Patient");

const MedicalHistory = sequelize.define("MedicalHistory", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  patient_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: "patients",
      key: "id"
    }
  },
  cedula: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "medical_histories",
  timestamps: true
});

// Relaciones
MedicalHistory.associate = (models) => {
  MedicalHistory.belongsTo(models.Patient, {
    foreignKey: "patient_id",
    onDelete: "CASCADE"
  });

  MedicalHistory.hasOne(models.ClinicalData, {
    foreignKey: "medical_history_id",
    as: "ClinicalData",
    onDelete: "CASCADE"
  });

  MedicalHistory.hasOne(models.Allergy, {
    foreignKey: "medical_history_id",
    onDelete: "CASCADE"
  });

  MedicalHistory.hasOne(models.GeneralMedicalHistory, {
    foreignKey: "medical_history_id",
    onDelete: "CASCADE"
  });

  MedicalHistory.hasOne(models.Diagnosis, {
    foreignKey: "medical_history_id",
    onDelete: "CASCADE"
  });

  MedicalHistory.hasMany(models.EvolutionDate, {
    foreignKey: "medical_history_id",
    onDelete: "CASCADE"
  });
};

module.exports = MedicalHistory;

// const { DataTypes } = require("sequelize");
// const sequelize = require("./db");

// const MedicalHistory = sequelize.define("MedicalHistory", {
//   id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
//   cedula: { type: DataTypes.STRING, allowNull: false }
// }, {
//   tableName: "medical_histories",
//   timestamps: true,
// });

// // Relaciones
// MedicalHistory.associate = (models) => {
//   MedicalHistory.belongsTo(models.Patient, {
//     foreignKey: "cedula",
//     targetKey: "cedula",
//     onDelete: "CASCADE"
//   });

//   MedicalHistory.hasOne(models.ClinicalData, {
//     foreignKey: "medical_history_id",
//     onDelete: "CASCADE"
//   });

//   MedicalHistory.hasOne(models.Allergy, {
//     foreignKey: "medical_history_id",
//     onDelete: "CASCADE"
//   });

//   MedicalHistory.hasOne(models.GeneralMedicalHistory, {
//     foreignKey: "medical_history_id",
//     onDelete: "CASCADE"
//   });

//   MedicalHistory.hasOne(models.Diagnosis, {
//     foreignKey: "medical_history_id",
//     onDelete: "CASCADE"
//   });

//   MedicalHistory.hasMany(models.EvolutionDate, {
//     foreignKey: "medical_history_id",
//     onDelete: "CASCADE"
//   });
// };

// module.exports = MedicalHistory;