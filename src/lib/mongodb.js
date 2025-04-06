// src/lib/mongodb.js

import { MongoClient } from "mongodb";

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable to cache the MongoClient instance
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = MongoClient.connect(process.env.MONGODB_URI);
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, use a cached MongoClient instance
  clientPromise = MongoClient.connect(process.env.MONGODB_URI);
}

export const connectToDatabase = async () => {
  try {
    console.log("Attempting to connect to MongoDB..."); // Add this log
    client = await clientPromise;
    const db = client.db();
    console.log("Connected to MongoDB!"); // Add this log when connection is successful
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Database connection failed");
  }
};
