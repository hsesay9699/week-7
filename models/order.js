const Sequelize = require('sequelize');
const sequelize = require('../util/database');

// Defining the Order model using Sequelize. 
// This table stores customer orders and links to the user who placed them.
const Order = sequelize.define('order', {
  // The 'id' serves as the primary key for the orders table. 
  // It is an auto-incrementing integer and cannot be null.
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Order;