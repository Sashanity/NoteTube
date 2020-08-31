const db = require('./util/admin');
const functions = require('firebase-functions');
const app = require('express')();
const { login, signup, auth } = require('./handlers/users');
const { upload } = require('./handlers/documents');
const { addNote } = require('./handlers/addNote');
const { addNote2 } = require('./handlers/addNote2');
const cors = require('cors');
app.use(cors());

app.post('/login', login);
app.post('/signup', signup);
app.post('/upload', upload);
app.post('/addNote', addNote)
app.post('/addNote2', addNote2)


exports.api = functions.https.onRequest(app);
