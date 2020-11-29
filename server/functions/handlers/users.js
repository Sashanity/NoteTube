const { admin, db } = require('../util/admin');
const firebase = require('firebase');
const firebaseConfig = require('../util/firebaseConfig');

const { validateSignup, validateLogin } = require('../util/validation');

firebase.initializeApp(firebaseConfig);

exports.login = (req, res) => {
	let user = {
		email: req.body.email,
		password: req.body.password,
	};

	const { valid, errors } = validateLogin(user);
	if (!valid) return res.status(400).json(errors);
	db.collection('users')
		.doc(user.email)
		.get()
		.then((doc) => {
			if (doc.exists) {
				user.email = doc.data().email;
			}
		})
		.then(() => {
			firebase
				.auth()
				.signInWithEmailAndPassword(user.email, user.password)
				.then((data) => {
					return data.user.getIdToken();
				})
				.then((token) => {
					return res.json({ token });
				})
				.catch((err) => {
					return res
						.status(403)
						.json({
							general:
								'Email/username or passwords are incorrect. Please try again',
						});
				});
		});
};

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
	db.doc(`/users/${newUser.username}`)
		.get()
		.then((doc) => {
			if (doc.exists) {
				return res
					.status(400)
					.json({ username: 'this username is already taken' });
			} else {
				return firebase
					.auth()
					.createUserWithEmailAndPassword(newUser.email, newUser.password);
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
				userId,
			};
			db.doc(`/users/${newUser.username}`).set(userCredentials);
		})
		.then(() => {
			return res.json({ token });
		})
		.catch((err) => {
			console.error(err);
			if (err.code === 'auth/email-already-in-use') {
				return res.status(400).json({ email: 'This email is in use already' });
			} else {
				return res.status(500).json({ error: err.code });
			}
		});
};

/***
 *Verify Token
 **Verifies the user's token to make sure it is still active
 **PARAMS:
 ***token: The authentication token of the user
 **RETURNS:
 ***Status: The status of the request. Will be an error if the note was not favorited correctly, either due to server error or due to user error
 ***Returns only on Success:
 ****Token: The user's token
 ***Returns only on Failure:
 ****Error: The error with verifying the token
 ***/
exports.verifyToken = (req, res) => {
	const token = req.query.token; //Get the token of the user from the URL
	if (token) { //Check to make sure the token was passed through
		admin.auth().verifyIdToken(token, true).then(function (decodedToken) {//Decodes the token to make sure it is still valid
			return res.status(200).json({ Status: "Successful", Token: token }); //Sends a 200 response to make sure the 
		})
			.catch(function (error) {
				if (error.code == 'auth/id-token-revoked') { //If the token had to be revoked, send error
					return res.status(400).json({ Status: "Revoked", Error: error });
				}
				else if (error.code == 'auth/id-token-expired') {
					return res.status(400).json({ Status: "Expired", Error: error })
				}
				else {
					return res.status(400).json({ Status: "Invalid", Error: error });
				}
			});
	}
	else {
		return res.status(400).json({ Status: "Need a Token in the parameters" });
	}
};
