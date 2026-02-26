// Replaced Sequelize with the native MongoDB driver to connect to a NoSQL database.
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

// Created a mongoConnect function that connects to MongoDB Atlas using my connection string.
// It stores the connection pool in the _db variable so we don't keep opening new connections.
const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://hsesay9699:K8qjwenJoMsP4xMf@cluster0.2xai0cn.mongodb.net/shop?appName=Cluster0' 
  )
    .then(client => {
      console.log('Connected to MongoDB!');
      // We are connecting to a database named 'shop'
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

// Created a getDb function that returns access to the database 
// if it exists, allowing other files to interact with the database.
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;