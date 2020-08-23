const { db, bucket } = require('../util/admin');
const { ref } = require('firebase-functions/lib/providers/database');
const fs = require('fs');
const os = require('os');
const Busboy = require('busboy');
const path = require('path');


exports.upload = (req, res) => {
	const busboy = new Busboy({ headers: req.headers });
        // This object will accumulate all the uploaded files, keyed by their name
        const uploads = {}

		// This callback will be invoked for each file uploaded
		//TODO: Save the document info to the firebase database
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            console.log(`File [${fieldname}] filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`);
            // Note that os.tmpdir() is an in-memory file system, so should only 
            // be used for files small enough to fit in memory.
            const filepath = path.join(os.tmpdir(), fieldname); //Gets the temporary directory that the file will go in
            uploads[fieldname] = { file: filepath } //Add the file to the uploads array
            console.log(`Saving '${fieldname}' to ${filepath}`);
            file.pipe(fs.createWriteStream(filepath)); //Takes the file, reads it, then writes it to the temporary dircetory
        });

        // This callback will be invoked after all uploaded files are saved.
        busboy.on('finish', () => {
            for (const name in uploads) {
				//TODO: Add Firebase upload 
                const upload = uploads[name];
				const file = upload.file;
                res.write(`${file}\n`); //Write the file location to the response
                fs.unlinkSync(file); //Unlinks and deletes the file
            }
            res.end();
        });

        // The raw bytes of the upload will be in req.rawBody.  Send it to busboy, and get
        // a callback when it's finished.
        busboy.end(req.rawBody);
}

