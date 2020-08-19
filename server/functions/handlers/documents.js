const { db, bucket } = require('../util/admin');
const { ref } = require('firebase-functions/lib/providers/database');
const fs = require('fs');
const os = require('os');
const Busboy = require('busboy');
const path = require('path');

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
	const busboy = new Busboy({ headers: req.headers });
        // This object will accumulate all the uploaded files, keyed by their name
        const uploads = {}

        // This callback will be invoked for each file uploaded
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            console.log(`File [${fieldname}] filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`);
            // Note that os.tmpdir() is an in-memory file system, so should only 
            // be used for files small enough to fit in memory.
            const filepath = path.join(os.tmpdir(), fieldname);
            uploads[fieldname] = { file: filepath }
            console.log(`Saving '${fieldname}' to ${filepath}`);
            file.pipe(fs.createWriteStream(filepath));
        });

        // This callback will be invoked after all uploaded files are saved.
        busboy.on('finish', () => {
            for (const name in uploads) {
                const upload = uploads[name];
				const file = upload.file;
                res.write(`${file}\n`);
                fs.unlinkSync(file);
            }
            res.end();
        });

        // The raw bytes of the upload will be in req.rawBody.  Send it to busboy, and get
        // a callback when it's finished.
        busboy.end(req.rawBody);
}

