const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Allergy = sequelize.define("Allergy", {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  medical_history_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  analgesicos: DataTypes.STRING,
  anestesicos: DataTypes.STRING,
  yodo: DataTypes.STRING,
  adhesivos: DataTypes.STRING,
  material_sutura: DataTypes.STRING,
  otros: DataTypes.STRING
}, {
  tableName: "allergies",
  timestamps: true,
});

Allergy.associate = (models) => {
  Allergy.belongsTo(models.MedicalHistory, {
    foreignKey: "medical_history_id",
    onDelete: "CASCADE"
  });
};

module.exports = Allergy;
