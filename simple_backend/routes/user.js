const express = require("express");
const router = express.Router();
``;
const { getUsersCollection } = require("../config/db");
const bcrypt = require("bcryptjs"); // Use bcrypt for password hashing
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;
const { ObjectId } = require("mongodb");

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

router.get("/", (req, res) => {
  console.log();
  res.send("Hello from user.js");
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ email });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const accessToken = jwt.sign(
          { userId: user._id, email: user.email },
          JWT_SECRET,
          { expiresIn: "1d" },
        );

        const refreshToken = jwt.sign(
          { userId: user._id, email: user.email },
          JWT_SECRET,
          { expiresIn: "7d" },
        );

        console.log("User", email, user._id, "logged in");
        req.session.userId = user._id;
        req.session.authenticated = true;
        //console.log('Session:', req.session);
        res.status(200).json({
          access: accessToken,
          refresh: refreshToken,
        });
      } else {
        res.status(401).json({
          detail: "Password salah",
        });
      }
    } else {
      res.status(404).json({
        detail: "User tidak ditemukan",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal server error");
  }
});

router.post("/register", async (req, res) => {
  const { username, email, password1 } = req.body;

  console.log("Registering user with email:", password1);
  try {
    const usersCollection = await getUsersCollection();

    const existingUser = await usersCollection.findOne({ email: email });

    if (existingUser) {
      console.log("User with email", email, "already exists");
      return res
        .status(409)
        .json({ non_field_errors: ["User sudah terdaftar"] });
    }

    const hashedPassword = await bcrypt.hash(password1, SALT_ROUNDS);

    await usersCollection.insertOne({
      username: username,
      email: email,
      password: hashedPassword,
    });

    console.log("User", email, "registered");
    res.status(201).json({ message: "Registrasi berhasil" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ detail: "Internal server error" });
  }
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ detail: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const accessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({ access: accessToken });
  } catch (error) {
    console.error("Error during token refresh:", error);
    res.status(401).json({ detail: "Token tidak valid" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      res.status(500).json({ message: "Internal server error" });
    } else {
      res.status(200).json({ message: "Logged out" });
    }
  });
});

router.get("/profile", async (req, res) => {
  const getSessionUserId = () => {
    // Get the first session key
    const sessionKey = Object.keys(req.sessionStore.sessions)[0];
    console.log("Session key:", sessionKey);
    if (!sessionKey) {
      return null;
    }

    try {
      // Parse the session string into an object
      const sessionData = JSON.parse(req.sessionStore.sessions[sessionKey]);
      console.log("Session data:", sessionData);
      return sessionData.userId;
    } catch (error) {
      console.error("Error parsing session data:", error);
      return null;
    }
  };
  console.log(req.sessionStore);
  //const userId = req.sessionID.userId;
  //console.log('Requesting profile for user:', req.session);
  const userId = getSessionUserId();
  if (!userId) {
    return res.status(401).json({ detail: "Not authenticated" });
  }
  
  const usersCollection = await getUsersCollection();
  const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

  if (!user) {
    return res.status(404).json({ detail: "User not found" });
  }

  res.status(200).json({ email : user.email, username : user.username, id : user._id, name : user.name, image : user.image });
});

router.post("/profile", async (req, res) => {
  const { username, name, image } = req.body;

  const userId = getSessionUserId(req.sessionStore);
  const usersCollection = await getUsersCollection();
  const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

  if (!user) {
    return res.status(404).json({ detail: "User not found" });
  }

  await usersCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { username: username, name: name, image: image } },
  );

  res.status(200).json({ message: "Profile updated" });
});

module.exports = router;
