const Sequelize = require('sequelize');
const sequelize = require('../util/database');

// Defining the OrderItem model. This acts as a "through" table
// to establish a Many-To-Many relationship between Orders and Products.
const OrderItem = sequelize.define('orderItem', {
  // The primary key 'id' for the order-item connection table.
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  // The 'quantity' field tracks how many of a specific product were purchased in a specific order.
  quantity: Sequelize.INTEGER
});

module.exports = OrderItem;