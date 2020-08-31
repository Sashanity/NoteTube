const { db, bucket } = require('../util/admin');
const { ref } = require('firebase-functions/lib/providers/database');
const fs = require('fs');
const os = require('os');
const Busboy = require('busboy');
const path = require('path');


exports.upload = (req, res) => {
    const busboy = new Busboy({ headers: req.headers });
    const uploads = {}
    let filesURL = {}


    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log(`File [${fieldname}] filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`);


        const filepath = path.join(os.tmpdir(), filename); //Gets the temporary directory that the file will go inz
        uploads[fieldname] = { file: filepath } //Add the file to the uploads array
        console.log(`Saving '${fieldname}' to ${filepath}`);
        file.pipe(fs.createWriteStream(filepath)); //Takes the file, reads it, then writes it to the temporary dircetory
    });

    busboy.on('finish', () => {
        for (const name in uploads) {
            const upload = uploads[name];
            const file = upload.file;
            bucket
                .upload(file)

                .then((data) => {
                    // console.log(data)
                    // console.log('======================================')
                    // console.log(data[1].selfLink)
                    let fileURL = data[1].selfLink

                    console.log('upload success');
                    //res.write(`${file}\n`); //Write the file location to the response
                    // fs.unlinkSync(file); //Unlinks and deletes the file
                    // return res.status(200);

                    return res.json({ message: 'Doc added successfully', fileURL: fileURL });
                })

                .catch(err => {
                    // fs.unlinkSync(file); //Unlinks and deletes the file
                    console.log('error uploading to storage', err);
                    return res.status(500).err(err);
                });

        }

        // res.end();
    });
    busboy.end(req.rawBody);
}

