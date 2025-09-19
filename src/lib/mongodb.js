// lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = `mongodb+srv://akanshsaxena723:h35V29AK5RZuLXbn@safepaste.ihi6oge.mongodb.net/?retryWrites=true&w=majority&appName=Safepaste`
const options = {};

let client;
let clientPromise;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env");
}

if (process.env.NODE_ENV === "development") {
  // In dev mode, use a global var so it doesn’t keep creating new clients on hot reloads
  if (!(global)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global)._mongoClientPromise = client.connect();
  }
  clientPromise = (global)._mongoClientPromise;
} else {
  // In production, always create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
