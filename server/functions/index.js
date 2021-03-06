const db = require('./util/admin');
const functions = require('firebase-functions');
const app = require('express')();
const { login, signup, auth, verifyToken } = require('./handlers/users');
const {
  upload,
  preview,
  userList,
  editNote,
  deleteNote,
  favoriteNote,
  unfavoriteNote,
  hasFavoritedNote,
  favoriteList,
} = require('./handlers/documents');

const cors = require('cors');
app.use(cors());

app.post('/login', login);
app.post('/signup', signup);
app.post('/upload', upload);
app.get('/preview', preview);
app.get('/verifyToken', verifyToken);
app.get('/userList', userList);
app.put('/editNote', editNote);
app.delete('/deleteNote', deleteNote);
app.post('/favoriteNote', favoriteNote);
app.delete('/unfavoriteNote', unfavoriteNote);
app.get('/hasFavoritedNote', hasFavoritedNote);
app.get('/favoriteList', favoriteList);

exports.api = functions.https.onRequest(app);
