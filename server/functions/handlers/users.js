const { db } = require('../util/admin');
const firebase = require('firebase');
const firebaseConfig = require('../util/firebaseConfig');

const {
    validateSignup,
    validateLogin
} = require('../util/validation');

firebase.initializeApp(firebaseConfig)

exports.login = (req, res) => {
    let user = {
        email: req.body.email,
        password: req.body.password
    };

    db.collection('users').doc(user.email).get()
        .then(doc => {
            if (doc.exists) {
                user.email = doc.data().email;
            }
        })
        .then(() => {
            const { valid, errors } = validateLogin(user);
            if (!valid) return res.status(400).json(errors);
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
                    return res.status(403).json({ general: 'Email/username or passwords are incorrect. Please try again' })
                })
        })
}

exports.signup = (req, res) => {
    const newUser = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username, // unique
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    };
    const { valid, errors } = validateSignup(newUser);
    if (!valid) return res.status(400).json(errors);
    let userId, token;
    db.doc(`/users/${newUser.username}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({ username: 'this username is already taken' });
            } else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                username: newUser.username,
                email: newUser.email,
                userId
            };
            db.doc(`/users/${newUser.username}`).set(userCredentials);
        })
        .then(() => {
            return res.json({ token });
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