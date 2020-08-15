const { db, bucket } = require('../util/admin');
const { ref } = require('firebase-functions/lib/providers/database');

const createKeywords = (input) => {
	const arrName = [];
	let curName = '';
	input.split('').forEach((letter) => {
		curName += letter;
		arrName.push(curName);
	});
	return arrName;
};

const generateKeywords = (inputs) => {
	const [name, course] = inputs;
	const keywordNameCourse = createKeywords(`${name}`);
	const keywordCourseName = createKeywords(`${course}`);
	return [...new Set(['', ...keywordNameCourse, ...keywordCourseName])];
};

exports.search = (req, res) => {
	const input = req.query.searchInput.trim();
	const input2 = req.query.searchInput.toUpperCase();
	let map = new Map();
	let result = [];
	db.collection('notes')
		.where('published', '==', true)
		.where('keywords', 'array-contains', input)
		.get()
		.then((querySnapShot) => {
			querySnapShot.forEach(function (doc) {
				map.set(doc.id, doc.data());
			});
		})
		.catch(function (error) {
			return res.status(400).json(error);
		});
	db.collection('notes')
		.where('published', '==', true)
		.where('keywords', 'array-contains', input2)
		.get()
		.then((querySnapShot) => {
			querySnapShot.forEach(function (doc) {
				if (!map.has(doc.id)) map.set(doc.id, doc.data());
			});
			map.forEach((element) => {
				result.push(element);
			});
			var obj = [];
			for (let [key, value] of map) {
				obj.push({ key: key, value: value });
			}
			return res.status(200).json(obj);
		})
		.catch(function (error) {
			return res.status(400).json(error);
		});
};

exports.upload = (req, res) => {
	console.log('Upload Image');

	let file = req.file;
	if (file) {
		res.status(200).send({
			status: 'success'
		});
	}
	else{
		res.status(400).send({
			status: 'failure to get image'
		});
	}
};
