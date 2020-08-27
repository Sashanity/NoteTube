const db = require('./util/admin');
const functions = require('firebase-functions');
const app = require('express')();
const { login, signup, auth } = require('./handlers/users');
const { upload } = require('./handlers/documents');
<<<<<<< HEAD
const { addNote } = require('./handlers/addNote');
=======
>>>>>>> firebaseFileUpload
const cors = require('cors');
app.use(cors());

app.post('/login', login);
app.post('/signup', signup);
app.post('/upload', upload);
<<<<<<< HEAD
app.post('/addNote', addNote)
=======

>>>>>>> firebaseFileUpload
exports.api = functions.https.onRequest(app);
