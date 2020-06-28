const db = require('./util/admin');
const functions = require('firebase-functions');
const app = require('express')();
const { login, signup, auth } = require('./handlers/users');
const { search } = require('./handlers/documents');
const cors = require('cors');
app.use(cors());

app.post('/login', login);
app.post('/signup', signup);
app.get('/search', search);

exports.api = functions.https.onRequest(app);
