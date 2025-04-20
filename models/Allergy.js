const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Allergy = sequelize.define("Allergy", {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  medical_history_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  analgesicos: DataTypes.TEXT,
  anestesicos: DataTypes.TEXT,
  antibioticos: DataTypes.TEXT,
  yodo: DataTypes.TEXT,
  adhesivos: DataTypes.TEXT,
  material_sutura: DataTypes.TEXT,
  otros: DataTypes.TEXT
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
