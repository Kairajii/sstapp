import { MongoClient } from "mongodb";

const url = process.env.MONGO_URL as string;
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_NAME as string;

const client = new MongoClient(url);

export async function insertToDB(doc:any) {
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  await collection.insertOne(doc)
}
