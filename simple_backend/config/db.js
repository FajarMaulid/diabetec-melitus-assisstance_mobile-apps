const { MongoClient } = require('mongodb');
require('dotenv').config(); // Load environment variables

let client;

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('MONGO_URI environment variable is missing!');
  process.exit(1); // Exit the process if MONGO_URI is not defined
}

// Create a function to connect to MongoDB
const connectToDb = async () => {
  try {
    if (client) {
      return db; // If client already exists, return the existing db connection
    }

    client = await MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(process.env.DB_NAME); // Use default database (or specify your database name here)
    //console.log('Connected to MongoDB');

    return db; // Return the db object for further usage
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit if there's a connection error
  }
};

// Export the connectToDb function and optionally the collections you need
module.exports = {
  connectToDb,
  getUsersCollection: async () => {
    const db = await connectToDb(); // Ensure connection is established
    return db.collection('User'); // Replace with your collection name
  },
  getGulaDarahCollection: async () => {
    const db = await connectToDb(); // Ensure connection is established
    return db.collection('gulaDarah'); // Replace with your collection name
  },
  getAktivitasCollection: async () => {
    const db = await connectToDb(); // Ensure connection is established
    return db.collection('aktivitasFisik'); // Replace with your collection name
  },
  getKonsumsiCollection: async () => {
    const db = await connectToDb(); // Ensure connection is established
    return db.collection('konsumsi'); // Replace with your collection name
  },
  getChatCollection: async () => {
    const db = await connectToDb(); // Ensure connection is established
    return db.collection('messages'); // Replace with your collection name
  },
};

