const functions = require('firebase-functions');
const app = require('express')();

const cors = require('cors');
app.use(cors());

const { db } = require('./util/admin');

const {
    signup,
    login
} = require('./handlers/userHandlers');

app.post('/signup', signup);
app.get('/login', login);

exports.api = functions.https.onRequest(app);