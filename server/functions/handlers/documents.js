const { admin, db, bucket } = require('../util/admin');
const { ref } = require('firebase-functions/lib/providers/database');
const fs = require('fs');
const os = require('os');
const Busboy = require('busboy');
const path = require('path');


exports.upload = (req, res) => {


    const busboy = new Busboy({ headers: req.headers });
    const uploads = {};
    //TODO: Figure out how to get the token
    const idToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjUxMDM2YWYyZDgzOWE4NDJhZjQzY2VjZmJiZDU4YWYxYTc1OGVlYTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbm90ZXR1YmUtZjNmOWMiLCJhdWQiOiJub3RldHViZS1mM2Y5YyIsImF1dGhfdGltZSI6MTU5ODkxMTIzMiwidXNlcl9pZCI6ImtBc3dVMm9kN3llRlJlSU9uMWdjblVJdFVyejIiLCJzdWIiOiJrQXN3VTJvZDd5ZUZSZUlPbjFnY25VSXRVcnoyIiwiaWF0IjoxNTk4OTExMjMyLCJleHAiOjE1OTg5MTQ4MzIsImVtYWlsIjoiYWxla3NhbmRyYS5raG92aW5hQHNqc3UuZWR1IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFsZWtzYW5kcmEua2hvdmluYUBzanN1LmVkdSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.lSiUusc6IZk16uay1fUhHpstDEEZcYkhQOWj_YowVlqMVVlZ7ZRGe7Syalh0IZ1Oe70WnCyMrHdu0z07KFlTq5dr3bRBqgcI7ENxWNriAD9Ffl1OiZqC1ujvu443OfBhtemDR8FGBOJDvIfqRhz26tGsaNLMDFg4YvcB46R2EST_w1mVR0AF5mZ65iT652X1unmejZoVhzbT34FqF_MoUtIb-DqOWCTTK4UxH50VwACPZBib7UNPm2RctMhgUFQKCLySVwc1Wbb-9zQYv0AUJj-kf1yJIhC02R9t_1CwhV0WUEIw0Zmh_omTl5wpu3luxNkQm2hdUuFQq0gE2fCdLA";
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
                    console.log('upload success');
                    const newNote = {
                        name: returnval.name,
                        course: returnval.course,
                        term: returnval.term,
                        instructor: returnval.instructor,
                        owner: returnval.owner,
                        public: returnval.public,
                        // this should come from the storage
                        docURL: data[1].selfLink,
                        timestamp: admin.firestore.Timestamp.fromDate(new Date()),
                    };
                    console.log(newNote)

                    db.collection('notes-url').add(newNote)
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
