const express = require('express');
const router = express.Router();
const { getAktivitasCollection } = require('../config/db');

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
  const aktivitasCollection = await getAktivitasCollection();
  const aktivitas = await aktivitasCollection.find({ userId: getSessionUserId(req.sessionStore) }).sort({ createdAt: -1 }).toArray();
  res.json(aktivitas);
});

router.get('/terakhir', async (req, res) => {
  const aktivitasCollection = await getAktivitasCollection();
  const aktivitas = await aktivitasCollection.find({ userId: getSessionUserId(req.sessionStore) }).sort({ createdAt: -1 }).limit(1).toArray();
  res.json(aktivitas[0]);
});

router.post('/', async (req, res) => {
  const newDocument = {
    ...req.body,          // Spread the existing body
    userId: getSessionUserId(req.sessionStore), // Add userId with the current user
    createdAt: new Date() // Add createdAt with current date and time
  };
  const aktivitasCollection = await getAktivitasCollection();
  const result = await aktivitasCollection.insertOne(newDocument);
  //res.json(result.ops[0]);
  res.json(result);
});

module.exports = router;
