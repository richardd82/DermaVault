// models/Patient.js
const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Patient = sequelize.define(
  "Patient",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    cedula: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    apellido: { type: DataTypes.STRING(100), allowNull: false },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    fecha_nacimiento: { type: DataTypes.DATEONLY },
    edad: { type: DataTypes.INTEGER },
    lugar_nacimiento: { type: DataTypes.STRING(100) },
    sexo: { type: DataTypes.ENUM("M", "F") },
    estado_civil: { type: DataTypes.STRING(50) },
    profesion: { type: DataTypes.STRING(150) },
    telefono_casa: { type: DataTypes.STRING(50) },
    telefono_trabajo: { type: DataTypes.STRING(50) },
    telefono_movil: { type: DataTypes.STRING(50) },
    email: { type: DataTypes.STRING(150), validate: { isEmail: true } },
    referido_por: { type: DataTypes.STRING(150) },
    direccion: { type: DataTypes.STRING(255) },
  },
  {
    tableName: "patients",
    timestamps: true,
  }
);

// Relactions
Patient.associate = (models) => {
  Patient.hasOne(require("./MedicalHistory"), {
    foreignKey: "patient_id",
    onDelete: "CASCADE",
  });
  Patient.hasOne(require("./AdministrativeData"), {
    foreignKey: "patient_id",
    onDelete: "CASCADE",
  });
};

module.exports = Patient;
