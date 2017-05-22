// app/model/models.js
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

var UserMeta = require('./User.js');

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

var User = sequelize.define('users', UserMeta.attributes, UserMeta.options)
User.sync({force: true});

// force: true will drop the table if it already exists
/*
User.sync({force: true}).then(() => {
  return User.create({
    firstName: 'John',
    lastName: 'Hancock'
  });
}).then(() => {
  User.findAll().then(users => {
    users.forEach(function(user) {
      console.log(user);
    }, this); 
  })
});
*/



// you can define relationships here
module.exports = sequelize;
module.exports.User = User