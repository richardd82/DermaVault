// models/db.js
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

let sequelize;
if (config.use_env_variable) {
  // sequelize = new Sequelize(process.env[config.use_env_variable], config);
  // console.log("DATABASE_URL:", process.env.DATABASE_URL);
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    dialect: config.dialect,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
    charset: 'utf8mb4',
    },
    define: {
      charset: 'utf8mb4', // <-- Agregado aquí
      collate: 'utf8mb4_unicode_ci', // <-- Agregado aquí
    },
  });
  // sequelize.options.logging = false;
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config,{
    ...config,
    logging: false,
    dialectOptions: {
      charset: 'utf8mb4',  // <-- Agregado aquí
    },
    define: {
      charset: 'utf8mb4',  // <-- Agregado aquí
      collate: 'utf8mb4_unicode_ci', // <-- Agregado aquí
    },
  });
  // sequelize.options.logging = false;
  console.log("🌙 Sequelize config OK");
}

module.exports = sequelize;
