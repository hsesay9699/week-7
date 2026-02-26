const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

// Import the error controller
const errorController = require('./controllers/error');
// Importing the new mongoConnect function instead of Sequelize.
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');
const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.set('view engine', 'ejs');
app.set('views', 'views'); // Tells Express where to look for templates

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// Updated the dummy user middleware to use the NoSQL User class.
// We fetch the user from MongoDB and instantiate a new User object 
// so we have access to our custom methods like addToCart().
app.use((req, res, next) => {
  User.findById('69a0d0a8e319a7369f0c7b99')
    .then(user => {
      // Create a fresh User object instance so we have the class methods attached
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Use the error controller to handle 404 requests
app.use(errorController.get404);

// Replaced sequelize.sync() with mongoConnect. 
// The server now only starts listening on port 3000 AFTER successfully connecting to MongoDB Atlas.
mongoConnect(() => {
  app.listen(3000);
});