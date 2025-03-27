const { MongoClient } = require('mongodb');

const connectionString = process.env.MONGODB_CONNECTION_STRING + '/diabestieDB';

const mongoClient = new MongoClient(connectionString);

module.exports = mongoClient;
