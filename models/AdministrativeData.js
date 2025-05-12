// models/AdministrativeData.js
const { DataTypes } = require("sequelize");
const sequelize = require("./db");
const Patient = require("./Patient");

const AdministrativeData = sequelize.define(
  "AdministrativeData",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    patient_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    no_cheque: { type: DataTypes.TEXT },
    no_recibo: { type: DataTypes.TEXT },
    rfc: { type: DataTypes.TEXT },
    cortesia: { type: DataTypes.TEXT},
  },
  {
    tableName: "administrative_data",
    timestamps: true,
  }
);

//Relations
AdministrativeData.associate = (models) => {
  AdministrativeData.belongsTo(Patient, {
    foreignKey: "patient_id",
    onDelete: "CASCADE",
  });
};

module.exports = AdministrativeData;
