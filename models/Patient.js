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
    cedula: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    apellido: { type: DataTypes.TEXT, allowNull: false },
    nombre: { type: DataTypes.TEXT, allowNull: false },
    fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: true},
    edad: { type: DataTypes.INTEGER },
    lugar_nacimiento: { type: DataTypes.TEXT },
    sexo: { type: DataTypes.ENUM("M", "F", "O") },
    estado_civil: { type: DataTypes.TEXT },
    profesion: { type: DataTypes.TEXT },
    telefono_casa: { type: DataTypes.TEXT },
    telefono_trabajo: { type: DataTypes.TEXT },
    telefono_movil: { type: DataTypes.TEXT },
    email: { type: DataTypes.TEXT, allowNull: true },
    referido_por: { type: DataTypes.TEXT },
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
