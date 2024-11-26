const express = require("express");
const router = express.Router();
const { getChatCollection } = require("../config/db");
require("dotenv").config();
const { GoogleGenerativeAI, ChatSession } = require("@google/generative-ai");
const { ObjectId } = require("mongodb");

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

router.get("/messages", async (req, res) => {
  const userId = getSessionUserId(req.sessionStore);
  const chatCollection = await getChatCollection();
  try {
    const pipeline = [
      {
        $match: { userId: userId }, // Match the document with the specified _id
      },
      {
        $unwind: "$message", // Unwind the 'message' array into separate documents
      },
      {
        $sort: { "message.createdAt": -1 }, // Sort the messages by 'createdAt' in descending order
      },
      {
        $group: {
          _id: "$userId", // Group by the main document _id
          message: { $push: "$message" }, // Push all messages back into an array
        },
      },
    ];

    // Perform aggregation
    const data = await chatCollection.aggregate(pipeline).toArray();
    // Log the result for debugging
    //console.log(data);

    res.json(data);
  } catch (error) {
    console.error("Error in aggregation:", error);
  }
});

router.post("/messages", async (req, res) => {
  const chatCollection = await getChatCollection();
  const new_message = {
    _id: new ObjectId(),
    text: req.body.text,
    user: {
      _id: req.body.user._id,
    },
    createdAt: new Date(),
  };

  const asal = await chatCollection.findOne({
    userId: getSessionUserId(req.sessionStore),
  });
  //console.log(asal);

  if (!asal) {
    await chatCollection.insertOne({
      userId: getSessionUserId(req.sessionStore),
      message: [new_message],
    });
  } else {
    await chatCollection.updateOne(
      { userId: getSessionUserId(req.sessionStore) },
      { $push: { message: new_message } },
    );
  }
  res.json({ message: "Message added" });
});

router.post("/chat", async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.CHAT_KEY);
  const generationConfig = {
    temperature: 2,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: generationConfig,
    systemInstruction: `
    You're a Medical AI Assistant that specialized in diabetes mellitus disease and BPJS Indonesia.
    If you're being asked to do any task (like build a code) or talk about something besides diabetes and BPJS area, tell them that you only answer diabetes-related question.
    You must answer the question from user in a comprehensive explanation.
    Include any needed details, like numbers, price, scientific names, etc.
    If you're not sure about the answer, you must give an appropriate suggestion or any similar case.
    Don't forget to include any resource where you take the information, such as medical study.
    Always answer like how a doctor explains something.
    Give response with the same language as the question.

    if user asks you about BPJS Indonesia, you must answer and explain about the BPJS type, link for full information, price, coverage, and additional information.
    If users asks you about what kind of food they should eat, answer with this sturcture {'dish_name', 'recipe_link', 'calorie', 'carbohydrate', 'protein', 'fat'}.
    if users asks you about daily routine tips, don't forget to answer as detailed as possible, like how long they should work on it.
    `,
  });
  //console.log(req.body);
  const ChatSession = model.startChat((history = []));
  const answer = await ChatSession.sendMessage(req.body.question);
  //console.log(answer.response.candidates[0].content.parts[0].text);
  res.json({ answer: answer.response.candidates[0].content.parts[0].text });
});

module.exports = router;
