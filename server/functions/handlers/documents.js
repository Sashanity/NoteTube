const { admin, db, bucket } = require('../util/admin');
const { ref } = require('firebase-functions/lib/providers/database');
const fs = require('fs');
const os = require('os');
const Busboy = require('busboy');
const path = require('path');


exports.upload = (req, res) => {
    const busboy = new Busboy({ headers: req.headers });
    const uploads = {}
    //TODO: Figure out how to get the token
    //const idToken = "ThisIsNotARealToken";
    var userID = "";
    
    //Checks the token to make sure the user is logged in
    admin.auth().verifyIdToken(idToken).then(function(decodedToken){
        console.log(decodedToken.uid);
        userID = decodedToken.uid; //Gets the user ID that will be used to place the file in that user's folder
        busboy.end(req.rawBody); //Calles the busboy functions below
    }).catch(function(error) {
        return res.status(400).json(error); //Didn't Log in correctly
    })

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log(`File [${fieldname}] filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`);
        const filepath = path.join(os.tmpdir(), filename); //Gets the temporary directory that the file will go in
        uploads[fieldname] = { file: filepath, name: filename } //Add the file to the uploads array
        console.log(`Saving '${fieldname}' to ${filepath}`);
        file.pipe(fs.createWriteStream(filepath)); //Takes the file, reads it, then writes it to the temporary dircetory
    });

    busboy.on('finish', () => {
        for (const name in uploads) {
            const upload = uploads[name];
            const file = upload.file;
            bucket.upload(file, {destination: `notes/${userID}/${upload.name}`}).then(data => {
                console.log('upload success');
                fs.unlinkSync(file); //Unlinks and deletes the file
            }).catch(err => {
                fs.unlinkSync(file); //Unlinks and deletes the file
                console.log('error uploading to storage', err);
                return res.status(500).json(err);
            });
            
        }
        return res.status(200).json({Status: "Uploaded"});
    });
    
}

exports.download = (req, res) => {
    
}

