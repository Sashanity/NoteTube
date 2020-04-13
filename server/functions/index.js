const db = require('./util/admin')
const functions = require('firebase-functions');
const app = require('express')();
const { login, signup } = require('./handlers/users');

app.post('/login', login)
app.post('/signup', signup)

// // checking auth for protected route
// app.get('/tests', (req, res) => {
//     db
//         .collection('testData')
//         .orderBy('createdAt', 'desc')
//         .get()
//         .then(data => {
//             let test = [];
//             data.forEach(doc => {
//                 test.push(doc.data());
//                 // test.push({
//                 //     objId: doc.id,
//                 //     ...doc.data()
//                 // })
//             });
//             return res.json(test);
//         })
//         .catch(err => console.error(err));

// })


// app.post('/add', (req, res) => {
//     const newDataObj = {
//         body: req.body.body,
//         userHandle: req.body.userHandle,
//         // createdAt: admin.firestore.Timestamp.fromDate(new Date())
//         createdAt: new Date().toISOString()
//     }
//     db
//         .collection('testData')
//         .add(newDataObj)
//         .then(doc => {
//             res.json({ message: `document ${doc.id} created succusfully` });

//         })
//         .catch(err => {
//             res.status(500).json({ error: `someting went wrong` });
//             console.error(err);
//         });
// })

exports.api = functions.https.onRequest(app);