const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };