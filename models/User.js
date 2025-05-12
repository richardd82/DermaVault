
const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'doctor', 'assistant'),
    allowNull: false,
    defaultValue: 'assistant'
  },
  first_name: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  last_name: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
});

//Relations
User.associate = (models) => {
    // User puede crear muchos pacientes
    User.hasMany(models.Patient, {
      foreignKey: 'created_by',
      as: 'patients_created',
    });

      // Hash password antes de crear usuario
  User.beforeCreate(async (user) => {    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });

  // Método para validar la contraseña
  User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

};

module.exports = User;
