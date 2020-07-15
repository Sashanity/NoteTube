const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const bucket = admin.storage().bucket();
module.exports = { admin, db, bucket };