const Sequelize = require('sequelize');
const sequelize = require('../util/database');

// Defining the CartItem model. This serves as a "through" table 
// to establish a Many-To-Many relationship between Carts and Products.
const CartItem = sequelize.define('cartItem', {

  // The primary key 'id' for the cart-item connection.
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  // The 'quantity' field tracks how many of a specific product are in a specific cart.
  quantity: Sequelize.INTEGER
});

module.exports = CartItem;