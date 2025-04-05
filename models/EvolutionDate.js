const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const EvolutionDate = sequelize.define("EvolutionDate", {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  medical_history_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  observation: DataTypes.TEXT
}, {
  tableName: "evolution_dates",
  timestamps: true,
});

EvolutionDate.associate = (models) => {
  EvolutionDate.belongsTo(models.MedicalHistory, {
    foreignKey: "medical_history_id",
    onDelete: "CASCADE"
  });
};

module.exports = EvolutionDate;
