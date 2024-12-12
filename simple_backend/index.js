const express = require('express');
const session = require('express-session');
const store = new session.MemoryStore();
const cors = require('cors');
require('dotenv').config();

//const config = require('./config/config.ts');
const app = express();

const corsOptions = {
  origin: process.env.EXPO,  // Ganti dengan URL aplikasi React Native Expo Anda
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,  // Izinkan pengiriman cookie dan sesi
};
app.use(cors(corsOptions));

require('dotenv').config();
app.use(express.json({ limit: '50mb' }));
// Mengimpor rute

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: store,
}));

app.use((req, res, next) => {
  //console.log('Session:', req.session);
  //console.log('Store:', store);
  next();
});

// Menggunakan middleware untuk parsing JSON
//app.use(express.json());

// Koneksi ke MongoDB
//let db;

//MongoClient.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
//  .then(client => {
//    db = client.db(config.dbName);
//    console.log('Connected to MongoDB');
//
//    // Menyeting database ke controller
//    require('./controllers/itemController').setDb(db);
//    require('./controllers/userController').setDb(db);
//  })
//  .catch(error => console.error(error));
//
// Menggunakan rute untuk item dan user

const userRouter = require('./routes/user');
const gulaDarahRouter = require('./routes/gulaDarah');
const aktivitasRouter = require('./routes/aktivitas');
const konsumsiRouter = require('./routes/konsumsi');
const chatRouter = require('./routes/chat');

app.use('/', userRouter);
app.use('/myapp/gulaDarah', gulaDarahRouter);
app.use('/myapp/aktivitas', aktivitasRouter);
app.use('/myapp/konsumsi', konsumsiRouter);
app.use('/myapp', chatRouter);

// Menjalankan server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});

module.exports = {app, store};
