const db = require('./util/admin');
const functions = require('firebase-functions');
const app = require('express')();
const { login, signup, auth } = require('./handlers/users');
const { search, upload } = require('./handlers/documents');

app.post('/login', login);
app.post('/signup', signup);
app.get('/search', search);
app.post('/upload', upload);

exports.api = functions.https.onRequest(app);
