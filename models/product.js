const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

// Rebuilt the Product model as a standard vanilla JavaScript class 
// using the native MongoDB driver instead of the Sequelize ORM.
class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
   // We check if an ID exists to determine if we are updating an existing product
    // or creating a new one. We also convert the string ID into a special MongoDB ObjectId.
    this._id = id ? new mongodb.ObjectId(id) : null;
    // Store the user ID in the database document
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // If _id exists, UPDATE the document in the 'products' collection
      dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: this });
    } else {
      // If no _id, INSERT a new document
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    // find() returns a cursor, toArray() gets all documents and turns them into a JavaScript array
    return db.collection('products')
      .find()
      .toArray()
      .then(products => {
        return products;
      })
      .catch(err => console.log(err));
  }

  static findById(prodId) {
    const db = getDb();
    // next() gets the last document returned by the cursor
    return db.collection('products')
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then(product => {
        return product;
      })
      .catch(err => console.log(err));
  }

  static deleteById(prodId) {
    const db = getDb();
    return db.collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then(result => {
        console.log('Deleted');
      })
      .catch(err => console.log(err));
  }
}

module.exports = Product;