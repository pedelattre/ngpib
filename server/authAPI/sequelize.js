const Sequelize = require('sequelize');
const sequelize = new Sequelize('authAPI', 'sa', '', {
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  // SQLite only
  storage: './sqlite3.db'
});

module.exports = sequelize;