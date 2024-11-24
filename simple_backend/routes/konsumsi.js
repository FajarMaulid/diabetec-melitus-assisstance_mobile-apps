const express = require('express');
const router = express.Router();
const { getKonsumsiCollection } = require('../config/db');
require('dotenv').config();

const getSessionUserId = (memoryStore) => {
  // Get the first session key
  const sessionKey = Object.keys(memoryStore.sessions)[0];
  console.log("Session key:", sessionKey);
  if (!sessionKey) {
    return null;
  }

  try {
    // Parse the session string into an object
    const sessionData = JSON.parse(memoryStore.sessions[sessionKey]);
    console.log("Session data:", sessionData);
    return sessionData.userId;
  } catch (error) {
    console.error("Error parsing session data:", error);
    return null;
  }
};

router.get('/', async (req, res) => {
  const konsumsiCollection = await getKonsumsiCollection();
  const konsumsi = await konsumsiCollection.find({ userId: getSessionUserId(req.sessionStore) }).sort({ createdAt: -1 }).toArray();
  res.json(konsumsi);
});

router.get('/terakhir', async (req, res) => {
  const konsumsiCollection = await getKonsumsiCollection();
  const konsumsi = await konsumsiCollection.find({ userId: getSessionUserId(req.sessionStore) }).sort({ createdAt: -1 }).limit(1).toArray();
  res.json(konsumsi[0]);
});

router.post('/', async (req, res) => {
  const newDocument = {
    ...req.body,          // Spread the existing body
    userId: getSessionUserId(req.sessionStore), // Add userId with the current user's ID
    createdAt: new Date() // Add createdAt with current date and time
  };
  const konsumsiCollection = await getKonsumsiCollection();
  const result = await konsumsiCollection.insertOne(newDocument);
  res.json(result);
});

module.exports = router;
