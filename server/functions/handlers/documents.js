const { db } = require('../util/admin');

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
			console.log('Error getting notes: ', error);
		});
	db.collection('notes')
		.where('published', '==', true)
		.where('keywords', 'array-contains', input2)
		.get()
		.then((querySnapShot) => {
			querySnapShot.forEach(function (doc) {
				if (!map.has(doc.id)) map.set(doc.id, doc.data());
			});
			console.log(map);
			res.status(200).send(map);
		})
		.catch(function (error) {
			console.log('Error getting notes: ', error);
		});
};
