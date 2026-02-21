const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');



// Import the error controller
const errorController = require('./controllers/error');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

app.set('view engine', 'ejs');
app.set('views', 'views'); // Tells Express where to look for templates

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
      .then(user => {
        req.user = user; // Store the Sequelize user object in the request
        next(); // Continue to the next middleware/route
      })
      .catch(err => console.log(err));
  });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Use the error controller to handle 404 requests
app.use(errorController.get404);

// Define Relationships (Associations)
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

// A User has one Cart, and a Cart belongs to a User (One-to-One)
User.hasOne(Cart);
Cart.belongsTo(User);

// A Cart has many Products, and a Product belongs to many Carts (Many-to-Many)
// We tell Sequelize to use the 'cartItem' model as the connection table
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// An Order belongs to one User, but a User can have many Orders (One-to-Many)
Order.belongsTo(User);
User.hasMany(Order);

// An Order can have many Products, and Products can be in many Orders (Many-to-Many)
Order.belongsToMany(Product, { through: OrderItem });

// Sync database 

sequelize.sync()
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
          // Create a dummy user if none exists
      return User.create({ name: 'Max', email: 'test@test.com' });
    }
    return user;
  })
  .then(user => {
    // Check if the user already has a cart
    return user.getCart().then(cart => {
      if (!cart) {
        // MAGIC METHOD: Create a cart for the user if they don't have one
        return user.createCart(); 
      }
      return cart;
    });
  })
  .then(cart => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

