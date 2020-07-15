const db = require('./util/admin');
const functions = require('firebase-functions');
const app = require('express')();
const fileUpload = require('express-fileupload');
const { login, signup, auth } = require('./handlers/users');
const { search, upload } = require('./handlers/documents');
const cors = require('cors');
app.use(cors());

app.use(fileUpload({
    createParentPath: true
}));

app.post('/login', login);
app.post('/signup', signup);
app.get('/search', search);
app.post('/upload', upload);

exports.api = functions.https.onRequest(app);
