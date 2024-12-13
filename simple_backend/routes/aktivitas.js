const express = require('express');
const router = express.Router();
const { getAktivitasCollection } = require('../config/db');
require("dotenv").config();
const { GoogleGenerativeAI, ChatSession } = require("@google/generative-ai");
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
  const kalori = req.body.kaloriTerbakar;
  console.log(kalori == "");
  if (kalori == "") {
    const genAI = new GoogleGenerativeAI(process.env.CHAT_KEY);
    const generationConfig = {
      temperature: 2,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 5,
      responseMimeType: "text/plain",
    };
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: generationConfig,
      systemInstruction: `
        Berapa kalori yang terbakar pada ${req.body.olahraga} dengan durasi selama ${req.body.durasi} menit, berikan angkanya saja tanpa perlu memberikan penjelasan yang lain, cukup dengan memberikan nilai kalori tanpa perlu penjelasan yang lain dan jangan berikan range
      `,
    });
    //console.log(req.body);
    const question = "Berapa kalori terbakar pada " + req.body.olahraga + " dengan durasi selama " + req.body.durasi + "menit , berikan angkanya saja tanpa perlu memberikan penjelasan yang lain, cukup dengan memberikan nilai kalori tanpa perlu penjelasan yang lain dan jangan berikan range";
    const ChatSession = model.startChat((history = []));
    const answer = await ChatSession.sendMessage(question);
    console.log(answer.response.candidates[0].content.parts[0].text);
    req.body.kaloriTerbakar = parseInt(answer.response.candidates[0].content.parts[0].text);
  }
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

router.post("/delete/", async (req, res) => {
  const aktivitasCollection = await getAktivitasCollection();
  const result = await aktivitasCollection.deleteOne({
    _id: new ObjectId(req.body.id),
  });
  console.log('delete');
  res.json(result);
})
module.exports = router;
