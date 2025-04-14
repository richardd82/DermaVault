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
    nombre: { type: DataTypes.TEXT, allowNull: false },
    fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: true},
    edad: { type: DataTypes.INTEGER },
    lugar_nacimiento: { type: DataTypes.STRING(100) },
    sexo: { type: DataTypes.ENUM("M", "F") },
    estado_civil: { type: DataTypes.STRING(50) },
    profesion: { type: DataTypes.STRING(150) },
    telefono_casa: { type: DataTypes.STRING(150) },
    telefono_trabajo: { type: DataTypes.STRING(150) },
    telefono_movil: { type: DataTypes.STRING(150) },
    email: { type: DataTypes.STRING(150), validate: { isEmail: true } },
    referido_por: { type: DataTypes.STRING(150) },
    direccion: { type: DataTypes.TEXT },
    created_by: { 
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true // O false si quieres forzar que siempre exista el usuario creador
    }
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
  Patient.belongsTo(models.User, { 
    foreignKey: 'created_by', 
    as: 'creator',
    onDelete: 'SET NULL'
  });
};

module.exports = Patient;
