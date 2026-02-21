const Sequelize = require('sequelize');

// Set up the Sequelize connection
// Parameters: 'database_name', 'username', 'password'
const sequelize = new Sequelize('node-complete', 'root', 'password', {
  dialect: 'mysql',
  host: '127.0.0.1' 
});

module.exports = sequelize;