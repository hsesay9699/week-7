const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    // We ensure the cart is an object with an items array
    this.cart = cart ? cart : { items: [] }; 
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    // Check if the product is already in the cart array
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      // If it exists, just increase the quantity
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      // If it's new, push it to the array with a quantity of 1
      updatedCartItems.push({ 
        productId: new ObjectId(product._id), 
        quantity: newQuantity 
      });
    }

    const updatedCart = { items: updatedCartItems };
    const db = getDb();
    
    // Update the specific user's document in the database with the new cart array
    return db.collection('users').updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: updatedCart } }
    );
  }

  getCart() {
    const db = getDb();
    // Create an array of just the product IDs from the cart
    const productIds = this.cart.items.map(i => i.productId);
    
    // Use the MongoDB $in operator to find all products that match those IDs
    return db.collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        // Map over the matching products to attach the quantities from the cart
        return products.map(p => {
          return {
            ...p,
            quantity: this.cart.items.find(i => {
              return i.productId.toString() === p._id.toString();
            }).quantity
          };
        });
      });
  }

  deleteItemFromCart(productId) {
    // Use standard JS filter() to keep everything EXCEPT the product we want to delete
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    const db = getDb();
    return db.collection('users').updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: { items: updatedCartItems } } }
    );
  }

  addOrder() {
    const db = getDb();
    // 1. Fetch all the rich product details currently in the cart
    return this.getCart()
      .then(products => {
        // 2. Create an order "snapshot" with the items and the user info
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.name
          }
        };
        // 3. Insert it into a brand new 'orders' collection
        return db.collection('orders').insertOne(order);
      })
      .then(result => {
        // 4. Empty the cart in our local object
        this.cart = { items: [] };
        // 5. Empty the cart in the database
        return db.collection('users').updateOne(
          { _id: new ObjectId(this._id) },
          { $set: { cart: { items: [] } } }
        );
      });
  }

  getOrders() {
    const db = getDb();
    // Find all orders where the nested user._id matches our logged-in user
    return db.collection('orders')
      .find({ 'user._id': new ObjectId(this._id) })
      .toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db.collection('users')
      .findOne({ _id: new ObjectId(userId) })
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => console.log(err));
  }
}

module.exports = User;