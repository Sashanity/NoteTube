const admin = require("firebase-admin")
const serviceAccount =  require("../../../../ServiceAccountKey.json")


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://notetube-f3f9c.firebaseio.com",
})

const db = admin.firestore()

module.exports = {admin, db}