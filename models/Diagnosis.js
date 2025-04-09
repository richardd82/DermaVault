const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Diagnosis = sequelize.define("Diagnosis", {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    medical_history_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    diagnostico_principal: {
      type: DataTypes.STRING,
      allowNull: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
    otros_diagnosticos: {
      type: DataTypes.STRING,
      allowNull: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
    
  }, {
    tableName: "diagnoses",
    timestamps: true,
  });
  
  Diagnosis.associate = (models) => {
    Diagnosis.belongsTo(models.MedicalHistory, {
      foreignKey: "medical_history_id",
      onDelete: "CASCADE"
    });
  };
  
  module.exports = Diagnosis;
  