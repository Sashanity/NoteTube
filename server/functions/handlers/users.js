const { db } = require('../util/admin');
const firebase = require('firebase');
const firebaseConfig = require('../util/firebaseConfig');
firebase.initializeApp(firebaseConfig)

exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };
    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({ token })
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code })
        })

}

exports.signup = (req, res) => {
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    }

    firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.status(201).json({ token }); // use this token for private routing and data acces
            // add to the user collection here
        })
        .catch((err) => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                return res.status(400).json({ email: "This email is in use already" });
            }
            else {
                return res.status(500).json({ error: err.code });
            }
        })
}