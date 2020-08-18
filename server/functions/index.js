const db = require('./util/admin');
const functions = require('firebase-functions');
const app = require('express')();
const multer = require('multer');
const { login, signup, auth } = require('./handlers/users');
const { search, upload } = require('./handlers/documents');

const storage = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 50 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
  });

app.post('/login', login);
app.post('/signup', signup);
app.get('/search', search);
app.post('/upload', storage.single('file'), upload);

exports.api = functions.https.onRequest(app);
