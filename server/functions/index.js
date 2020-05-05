const db = require('./util/admin')
const functions = require('firebase-functions');
const app = require('express')();
const { login, signup } = require('./handlers/users');

app.post('/login', login)
app.post('/signup', signup)

exports.api = functions.https.onRequest(app);