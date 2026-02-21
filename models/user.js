const Sequelize = require('sequelize');
const sequelize = require('../util/database');

// Defining the User model using the Sequelize ORM.
// This model represents the 'users' table in our MySQL database.
// It maps the JavaScript object properties to the database columns.
const User = sequelize.define('user', {
  // The 'id' column is set as an integer, automatically increments, 
  // cannot be null, and serves as the primary key for the table.
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  // The 'name' column is defined as a standard Sequelize STRING type.
  name: Sequelize.STRING,
  // The 'email' column is a STRING and is required (allowNull is false).
  email: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = User;