const express = require('express');
const router = express.Router();
const { getGulaDarahCollection } = require('../config/db');
require('dotenv').config();
const { ObjectId } = require('mongodb');

const getSessionUserId = (memoryStore) => {
  // Get the first session key
  const sessionKey = Object.keys(memoryStore.sessions)[0];
  //console.log("Session key:", sessionKey);
  if (!sessionKey) {
    return null;
  }

  try {
    // Parse the session string into an object
    const sessionData = JSON.parse(memoryStore.sessions[sessionKey]);
    //console.log("Session data:", sessionData);
    return sessionData.userId;
  } catch (error) {
    console.error("Error parsing session data:", error);
    return null;
  }
};

router.get('/', async (req, res) => {
  const gulaDarahCollection = await getGulaDarahCollection();
  const gulaDarah = await gulaDarahCollection.find({ userId: getSessionUserId(req.sessionStore)  }).sort({ createdAt: -1 }).toArray();
  res.json(gulaDarah);
});

router.get('/terakhir', async (req, res) => {
  const gulaDarahCollection = await getGulaDarahCollection();
  const gulaDarah = await gulaDarahCollection.find({ userId: getSessionUserId(req.sessionStore) }).sort({ createdAt: -1 }).limit(1).toArray();
  res.json(gulaDarah[0]);
});

router.post('/', async (req, res) => {
  const newDocument = {
    ...req.body,          // Spread the existing body
    userId: getSessionUserId(req.sessionStore), // Add userId with the current user
    createdAt: new Date() // Add createdAt with current date and time
  };
  const gulaDarahCollection = await getGulaDarahCollection();
  const result = await gulaDarahCollection.insertOne(newDocument);
  res.json(result);
});

router.post("/delete", async (req, res) => {
  const gulaDarahCollection = await getGulaDarahCollection();
  const result = await gulaDarahCollection.deleteOne({
    _id: new ObjectId(req.body.id),
  });
  console.log('delete');
  res.json(result);
})

module.exports = router;
