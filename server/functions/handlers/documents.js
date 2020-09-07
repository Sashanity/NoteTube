const { admin, db, bucket } = require('../util/admin');
const { ref } = require('firebase-functions/lib/providers/database');
const fs = require('fs');
const os = require('os');
const Busboy = require('busboy');
const path = require('path');
const { testLab } = require('firebase-functions');
const { response } = require('express');


exports.upload = (req, res) => {


    const busboy = new Busboy({ headers: req.headers });
    const uploads = {};
    //TODO: Figure out how to get the token
    const idToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ5YWQ5YmM1ZThlNDQ3OTNhMjEwOWI1NmUzNjFhMjNiNDE4ODA4NzUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbm90ZXR1YmUtZjNmOWMiLCJhdWQiOiJub3RldHViZS1mM2Y5YyIsImF1dGhfdGltZSI6MTU5OTQ2MzAyMywidXNlcl9pZCI6ImtBc3dVMm9kN3llRlJlSU9uMWdjblVJdFVyejIiLCJzdWIiOiJrQXN3VTJvZDd5ZUZSZUlPbjFnY25VSXRVcnoyIiwiaWF0IjoxNTk5NDYzMDIzLCJleHAiOjE1OTk0NjY2MjMsImVtYWlsIjoiYWxla3NhbmRyYS5raG92aW5hQHNqc3UuZWR1IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFsZWtzYW5kcmEua2hvdmluYUBzanN1LmVkdSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.xk7tbK-hbAC317bklcYBehhPHZi7ovsM-KEfom6gsT3NZbVWW_6VvGcPYVetA6I67_z_RyPjQHwMZUGvKiBYpibS-77bDrQ-3aGEY2OEDoql39Xe7jS2OQYOpBUEgVZRRa83tjako5_ybAxlwXDFv6M87kjCdIlyDKz1i6w6gHLT-yRqtO4ZuT6INlGSWowlFdrk5_Hqi1F1HFXuOBKBVDvKZihEkZevAFFYrjfzdue7Z_WT7hN-5C4n9arccJoyW11g7CP7Zz53BXvvg6MHW1tnGL1PaUTYRfGH1IScmc8kL9MrAH5ffrtN1qnuWkbHsc8VWONjHdxsw_kkxV6PBg"

    var userID = "";
    var returnval = {};



    //Checks the token to make sure the user is logged in
    admin.auth().verifyIdToken(idToken).then(function (decodedToken) {
        userID = decodedToken.uid; //Gets the user ID that will be used to place the file in that user's folder
        busboy.end(req.rawBody); //Calls the busboy functions below
    }).catch(function (error) {
        return res.status(400).json(error); //Didn't Log in correctly
    })

    //This reads the text fields from the form
    busboy.on('field', function (fieldname, val) {
        returnval[fieldname] = val; //Saves the fields as an object to upload to db.
    });



    //This reads the file fields from the form
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
            bucket.upload(file, { destination: `notes/${userID}/${upload.name}` })
                .then(data => {
                    console.log(data);
                    const newNote = {
                        name: returnval.name,
                        filename: upload.name,
                        course: returnval.course,
                        term: returnval.term,
                        instructor: returnval.instructor,
                        owner: returnval.owner,
                        public: returnval.public,
                        location: `notes/${userID}/${upload.name}`,
                        // this should come from the storage
                        //docURL: data[1].selfLink,
                        timestamp: admin.firestore.Timestamp.fromDate(new Date()),
                    };
                    console.log(newNote)

                    db.collection('notes-url').add(newNote);
                    //TODO: Return the note ID to send the user to.
                    fs.unlinkSync(file); //Unlinks and deletes the file
                }).catch(err => {
                    fs.unlinkSync(file); //Unlinks and deletes the file
                    console.log('error uploading to storage', err);
                    return res.status(500).json(err);
                });

        }
        return res.status(200).json({ Status: "Uploaded", field: returnval });
    });
    // db.collection('notes-url').add(newNote)
    // .then(() => {
    //     return res.json({ message: 'Note added successfully' });
    // })

}

//TODO: Validate users to make sure that private notes don't get sent back to just anyone.
//TODO: Make contentType dynamic rather than hardcoding it. Possibly use response in the readstream
exports.preview = (req, res) => {
    var noteRef = db.collection('notes-url').doc(req.query.noteid);
    var fileDir = "";
    noteRef.get().then(function (doc) {
        if (doc.exists) {
            noteData = doc.data();

            //const fileDest = downloadFile().catch(console.error);
            file = bucket.file(noteData.location);

            fileDir = path.join(os.tmpdir(), noteData.filename);
            file.createReadStream()
                .on('error', function (err) {
                    return res.status(500).json({ Status: err });
                })
                .on('response', function (response) {
                    console.log(response);
                })
                .on('end', function () {
                    fs.readFile(fileDir, function (err, data) {
                        res.contentType("application/pdf");
                        res.send(data);
                        fs.unlinkSync(fileDir);
                    });
                })
                .pipe(fs.createWriteStream(fileDir));

        }
        else {
            return res.status(404).json({ Status: "Not Found" });
        }
    }).catch(function (error) {
        return res.status(500).json({ Error: error });
    })


    //return res.status(200).json({ Status: "Found"})
}

