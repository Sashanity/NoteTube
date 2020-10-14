const { admin, db, bucket } = require('../util/admin');
const { ref } = require('firebase-functions/lib/providers/database');
const fs = require('fs');
const os = require('os');
const Busboy = require('busboy');
const path = require('path');
const { testLab } = require('firebase-functions');
const { response } = require('express');


exports.upload = (req, res) => {


    const busboy = new Busboy({ headers: req.headers }); //Busboy is used to parse the form-data
    const uploads = {}; //Where the form-data is stored
    const idToken = req.query.token; //The token of the user
    var userID = ""; //The user ID that will be received from the user
    var returnval = {}; //Returns the user's form-data after the upload is complete



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
        const filepath = path.join(os.tmpdir(), filename); //Gets the temporary directory that the file will go in
        uploads[fieldname] = { file: filepath, name: filename } //Add the file to the uploads array
        file.pipe(fs.createWriteStream(filepath)); //Takes the file, reads it, then writes it to the temporary dircetory
    });

    busboy.on('finish', () => {
        for (const name in uploads) {
            const upload = uploads[name]; //Get the object with the file
            const file = upload.file; //Get the file from the object
            bucket.upload(file, { destination: `notes/${userID}/${upload.name}` }) //Uploads the file to the storage bucket
                .then(data => {
                    const newNote = { //Create the note object that will be uploaded to Firestore
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

                    db.collection('notes').add(newNote).then(function(uploadDocRef){ //
                        
                        fs.unlinkSync(file); //Unlinks and deletes the file
                        return res.status(200).json({ Status: "Uploaded", noteID: uploadDocRef.id, field: returnval }); //Send the successful response back
                    })
                    .catch(function(error){
                        return res.status(500).json("Error Uploading"); //Problem adding the note to the Firestore
                    });
                    
                }).catch(err => {
                    fs.unlinkSync(file); //Unlinks and deletes the file
                    return res.status(500).json(err); //Error uploading to storage
                });

        }
        
    });
}

exports.preview = (req, res) => {
    const noteRef = db.collection('notes').doc(req.query.noteid); //Get the reference of the note data from Firestore using the note ID from the request
    var fileDir = ""; //The directory of the file
    var userID = ""; //The ID of the logged in user
    var contentType = "application/xml"; //The content type of the response that will be sent back
    if (req.query.token){
        admin.auth().verifyIdToken(req.query.token).then(function(decodedToken){ //Authenticate the token
            userID = decodedToken.uid; //Get the uid
        }).catch(function (error) {
            return res.status(400).json({Status: "Verification Error"}); //Didn't Log in correctly
        })
    }
    noteRef.get().then(function(doc){ //Get the note data from Firestore
        if (doc.exists){ //If the note data was found (I.E. the note ID was correct)
            noteData = doc.data(); //Put the data in a variable
            const isPublic = (noteData.public == 'true'); //Converts from string to boolean
            if (noteData.uploader === userID || isPublic){ //Verifies that the user is allowed to view the note (either they created it or it is public)
                file = bucket.file(`notes/${noteData.uploader}/${noteData.filename}`); //Constructs the url from the note data from Firestore
                
                fileDir = path.join(os.tmpdir(), noteData.filename); //Get the location of the temporary directory to place the file
                file.createReadStream() //Read the file
                .on('error', function(err){
                    return res.status(500).json({Status: err}); //Error reading the file
                })
                .on('response', function(response) {
                    contentType = response.headers['content-type']; //Get the type of file that it is
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
    
}

exports.editNote = (req, res) => {
    const token = req.query.token; //Get the token from the request
    const noteID = req.query.noteid; //Get the note ID from the request

    if (token && noteID){ //Make sure we got both the note ID and the token
        admin.auth().verifyIdToken(token).then(function(decodedToken){ //Verify the token is valid
            var userID = decodedToken.uid; //Get the user ID
            db.collection("notes").doc(noteID).get().then(function(doc){ //Get the document
                if (doc.exists){ //If the note exists
                    if (doc.data().uploader === userID){ //Make sure the user editing the note is the same user who uploaded it
                        const newNote = { //Create a new note to replace the old note
                            name: req.body.name,
                            filename: doc.data().filename,
                            subject: req.body.subject,
                            course: req.body.course,
                            term: req.body.term,
                            instructor: req.body.instructor,
                            owner: doc.data().owner,
                            public: req.body.public,
                            uploader: doc.data().uploader,
                            timestamp: doc.data().timestamp,
                        };
                        
                        db.collection("notes").doc(noteID).update(newNote).then(function(updatedDoc){ //Update the document
                            return res.status(200).json({Status: "Successful", noteID: noteID});
                        }).catch(function (error){ //Error: Issue updating the document
                            return res.status(500).json({Status: "Error Updating Doc"});
                        })
                    }
                    else{ //Error: User is not the original owner
                        return res.status(400).json({Status: "Not Authorized"});
                    }
                }
                else{ //Error: Note not found
                    return res.status(400).json({Status: "Note Not Found"});
                }
            }).catch(function(error){ //Error: Server issue getting the document
                res.status(500).json({Status: "Error getting doc"});
            })
        }).catch(function(error){ //Error: Server issue decoding token
            res.status(500).json({Status: error});
        })
    }
    else{ //Error: User forgot token and/or note ID
        return res.status(400).json({Status: "Token and/or Note ID is missing"});
    }
}
