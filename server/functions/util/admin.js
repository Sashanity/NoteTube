const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://notetube-f3f9c.firebaseio.com"
});

const db = admin.firestore();

module.exports={admin, db};