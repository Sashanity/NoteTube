const db = require('./util/admin');
const functions = require('firebase-functions');
const app = require('express')();
const { login, signup, auth, verifyToken } = require('./handlers/users');
const { upload, preview } = require('./handlers/documents');

const cors = require('cors');
app.use(cors());

app.post('/login', login);
app.post('/signup', signup);
app.post('/upload', upload);
app.get('/preview', preview);
app.get('/verifyToken', verifyToken);

exports.api = functions.https.onRequest(app);
