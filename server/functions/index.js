const db = require('./util/admin');
const functions = require('firebase-functions');
const app = require('express')();

const { login, signup, auth } = require('./handlers/users')
const { upload, preview, editNote, deleteNote } = require('./handlers/documents');

const cors = require('cors');
app.use(cors());

app.post('/login', login);
app.post('/signup', signup);
app.post('/upload', upload);
app.get('/preview', preview);
app.put('/editNote', editNote);
app.delete('/deleteNote', deleteNote);

exports.api = functions.https.onRequest(app);
