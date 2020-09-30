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
    const idToken = req.query.token;
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
                        subject: returnval.subject,
                        course: returnval.course,
                        term: returnval.term,
                        instructor: returnval.instructor,
                        owner: returnval.owner,
                        public: returnval.public,
                        uploader: userID,
                        timestamp: admin.firestore.Timestamp.fromDate(new Date()),
                    };

                    db.collection('notes').add(newNote).then(function(uploadDocRef){
                        
                        fs.unlinkSync(file); //Unlinks and deletes the file
                        return res.status(200).json({ Status: "Uploaded", noteID: uploadDocRef.id, field: returnval });
                    })
                    .catch(function(error){
                        //fs.unlinkSync(file); //Unlinks and deletes the file
                        console.log(error);
                        return res.status(500).json("Error Uploading");
                    });
                    
                }).catch(err => {
                    fs.unlinkSync(file); //Unlinks and deletes the file
                    console.log('error uploading to storage', err);
                    return res.status(500).json(err);
                });

        }
        
    });
    // db.collection('notes').add(newNote)
    // .then(() => {
    //     return res.json({ message: 'Note added successfully' });
    // })

}

exports.preview = (req, res) => {
    const noteRef = db.collection('notes').doc(req.query.noteid);
    var fileDir = "";
    var userID = "";
    var contentType = "application/xml";
    if (req.query.token){
        admin.auth().verifyIdToken(req.query.token).then(function(decodedToken){
            userID = decodedToken.uid; //Get the uid
        }).catch(function (error) {
            return res.status(400).json({Status: "Verification Error"}); //Didn't Log in correctly
        })
    }
    noteRef.get().then(function(doc){
        if (doc.exists){
            noteData = doc.data();
            const isPublic = (noteData.public == 'true'); //Converts from string to boolean
            if (noteData.uploader === userID || isPublic){
                //const fileDest = downloadFile().catch(console.error);
                file = bucket.file(`notes/${noteData.uploader}/${noteData.filename}`);
                
                fileDir = path.join(os.tmpdir(), noteData.filename);
                file.createReadStream()
                .on('error', function(err){
                    return res.status(500).json({Status: err});
                })
                .on('response', function(response) {
                    contentType = response.headers['content-type'];
                })
                .on('end', function() {
                    fs.readFile(fileDir, function (err, data){
                        res.contentType(contentType);
                        res.send(data);
                        fs.unlinkSync(fileDir);
                    });
                })
                .pipe(fs.createWriteStream(fileDir));
        }
            else{
                 return res.status(404).json({Status: "Not Found"});
            }
        }
        else{
            return res.status(404).json({Status: "Not Found"});
        }
    }).catch(function(error){
        return res.status(500).json({Error: error});
    })
    
    
    //return res.status(200).json({ Status: "Found"})
}

