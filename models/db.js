// models/db.js
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

let sequelize;
// if (config.use_env_variable) {
  // sequelize = new Sequelize(process.env[config.use_env_variable], config);
  // console.log("DATABASE_URL:", process.env.DATABASE_URL);
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: config.dialect,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

module.exports = sequelize;
