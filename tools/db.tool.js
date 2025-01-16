import { MongoClient } from "mongodb";

export const mongoClient = new MongoClient(process.env.MONGO_ATLAS_URL);


