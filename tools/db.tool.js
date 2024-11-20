const { MongoClient} = require("mongodb");

const mongoClient = new MongoClient(process.env.MONGO_URL);


module.exports = mongoClient;