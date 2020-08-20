const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');
const ALGOLIA_ID = functions.config().algolia.appid;
const ALGOLIA_SEARCH_KEY = functions.config().algolia.searchkey;
// Perform an Algolia search:
// https://www.algolia.com/doc/api-reference/api-methods/search/
var client2 = algoliasearch(ALGOLIA_ID, ALGOLIA_SEARCH_KEY);
var index = client2.initIndex('notes');

exports.search = (req, res) => {
	return index.search(req.query.searchInput).then(function (responses) {
		// Response from Algolia:
		// https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
		return res.status(200).json(responses.hits);
	});
};

// exports.addDocument = (req, res) => {
// 	let course = req.query.course;
// 	let name = req.query.name;

// }

// const createKeywords = (input) => {
// 	const arrName = [];
// 	let curName = '';
// 	input.split('').forEach((letter) => {
// 		curName += letter;
// 		arrName.push(curName);
// 	});
// 	return arrName;
// };

// const generateKeywords = (inputs) => {
// 	const [name, course] = inputs;
// 	const keywordNameCourse = createKeywords(`${name}`);
// 	const keywordCourseName = createKeywords(`${course}`);
// 	return [...new Set(['', ...keywordNameCourse, ...keywordCourseName])];
// };

// exports.search = (req, res) => {
// 	const input = req.query.searchInput.trim();
// 	const input2 = req.query.searchInput.toUpperCase();
// 	let map = new Map();
// 	let result = [];
// 	db.collection('notes')
// 		.where('published', '==', true)
// 		.where('keywords', 'array-contains', input)
// 		.get()
// 		.then((querySnapShot) => {
// 			querySnapShot.forEach(function (doc) {
// 				map.set(doc.id, doc.data());
// 			});
// 		})
// 		.catch(function (error) {
// 			return res.status(400).json(error);
// 		});
// 	db.collection('notes')
// 		.where('published', '==', true)
// 		.where('keywords', 'array-contains', input2)
// 		.get()
// 		.then((querySnapShot) => {
// 			querySnapShot.forEach(function (doc) {
// 				if (!map.has(doc.id)) map.set(doc.id, doc.data());
// 			});
// 			map.forEach((element) => {
// 				result.push(element);
// 			});
// 			var obj = [];
// 			for (let [key, value] of map) {
// 				obj.push({ key: key, value: value });
// 			}
// 			return res.status(200).json(obj);
// 		})
// 		.catch(function (error) {
// 			return res.status(400).json(error);
// 		});
// };
