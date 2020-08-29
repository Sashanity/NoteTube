const { db, bucket } = require('../util/admin');
const { ref } = require('firebase-functions/lib/providers/database');
const fs = require('fs');
const os = require('os');
const Busboy = require('busboy');
const path = require('path');


exports.upload = (req, res) => {
    const busboy = new Busboy({ headers: req.headers });
    let uploads = {}
    let noteFilename
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log(`File [${fieldname}] filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`);
        const noteExtension = filename.split('.')[filename.split('.').length - 1];

        noteFilename = `${Math.round(
            Math.random() * 1000000000000
        ).toString()}.${noteExtension}`;


        const filepath = path.join(os.tmpdir(), noteFilename); //Gets the temporary directory that the file will go in
        uploads[fieldname] = { file: filepath } //Add the file to the uploads array
        uploads = { filepath, mimetype };
        console.log(`Saving '${fieldname}' to ${filepath}`);

    });

    busboy.on('finish', () => {
        for (const name in uploads) {
            const upload = uploads[name];
            const file = upload.file;
            // bucket.upload(file, { destination: "test/" })
            bucket.upload(uploads.filepath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: uploads.mimetype
                    }
                }
            })
                .then(data => {
                    console.log('upload success');
                    //res.write(`${file}\n`); //Write the file location to the response
                    // fs.unlinkSync(file); //Unlinks and deletes the file
                    // return res.status(200);
                }).catch(err => {
                    fs.unlinkSync(file); //Unlinks and deletes the file
                    console.log('error uploading to storage', err);
                    return res.status(500).err(err);
                });

        }

        res.end();
    });
    busboy.end(req.rawBody);
}

