const db = require('./util/admin');
const functions = require('firebase-functions');
const app = require('express')();
const { login, signup, auth } = require('./handlers/users');
const cors = require('cors');
app.use(cors());

app.post('/login', login);
app.post('/signup', signup);
app.get('/auth', auth);

exports.api = functions.https.onRequest(app);
