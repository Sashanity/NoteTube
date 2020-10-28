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

exports.deleteNote = (req, res) => {
    const noteRef = db.collection('notes').doc(req.query.noteid); //Get the reference of the note data from Firestore using the note ID from the request
    var userID = ""; //The ID of the logged in user
    if (req.query.token){
        admin.auth().verifyIdToken(req.query.token).then(function(decodedToken){ //Authenticate the token
            userID = decodedToken.uid; //Get the uid
        }).catch(function (error) {
            return res.status(400).json({Status: "Verification Error"}); //Didn't Log in correctly
        })
        noteRef.get().then(function(doc){ //Get the note data from Firestore
            if (doc.exists){ //If the note data was found (I.E. the note ID was correct)
                noteData = doc.data(); //Put the data in a variable
                if (noteData.uploader === userID){ //Verifies that the user is allowed to delete the note
                    bucket.file(`notes/${noteData.uploader}/${noteData.filename}`).delete().then(function(){
                        noteRef.delete().then(function(){
                            return res.status(200).json({Status: "Delete Successful"});
                        }).catch(function(error){return res.status(500).json({Status: error});});
                    }).catch(function(error){return res.status(500).json({Status: error})});
                }
                else{
                    return res.status(404).json({Status: "Not Authorized"});
                }
            }
            else{
                return res.status(404).json({Status: "Not Found"});
            }
        }).catch(function(error){return res.status(500).json({Error: error})});
    }
    else{
        return res.status(400).json({Error: "No Token was Sent"});
    }

}

/***
 *Favorite Note
 **Saves the users favorites to Firestore
 **PARAMS:
 ***token: The authentication token of the user
 ***noteid: The ID  of the note the user wants to favorite
 **RETURNS:
 ***Status: The status of the request. Will be an error if the note was not favorited correctly, either due to server error or due to user error
 ***/
exports.favoriteNote = (req, res) => { 
    const favCollection = db.collection("favorites");
    if (req.query.token && req.query.noteid){ //Checks to make sure the note id and token are in the request params.
        admin.auth().verifyIdToken(req.query.token).then(function(decodedToken) { //Admin decodes the token
            const userID = decodedToken.uid; //Get the user id
            const noteID = req.query.noteid;
            db.collection('notes').doc(noteID).get().then(function(doc){
                if (doc.exists){ //If the note id is real
                    favCollection.where("noteid", "==", noteID).where("userid", "==", userID).get().then(function(querySnapshot){
                        if(querySnapshot.empty){
                            const newFav = { //Create a new favorite object to add to Firestore with the user id, note id, and current datetime
                                userid: userID,
                                noteid: noteID,
                                timestamp: admin.firestore.Timestamp.fromDate(new Date())
                            }
                            favCollection.add(newFav).then(function(favRef){ //Adds the favorite to firestore and returns a successful response
                                return res.status(200).json({Status: "Successful"});
                            })
                            .catch(function(error){ //Returns server error if fails during favorite upload
                                return res.status(500).json({Status: error});
                            });
                        }
                        else{ //Returns user error if the user already favorited the note
                            return res.status(400).json({Status: "User already favoirted the note"})
                        }
                    })
                    .catch(function(error){ //Returns server error if issue looking at the favorites
                        return res.status(500).json({Status: error2});
                    });
                   
                }
                else{ //Returns user error if the note doesn't exist
                    return res.status(400).json({Status: "Note not found"});
                }
            })
            
            .catch(function(error){ //Returns server error if fails during retrival of note
                return res.status(500).json({Status: error});
            })
        
        })
        .catch(function(error){ //Returns user error if fails during verification
            return res.status(400).json({Status: error});
        });
    }
    else{ //Returns user error if either the token or note are not there
        return res.status(400).json({Status: "Need both the token and the ID of the note"});
    }
}

/***
 *Unfavorite Note
 **Remvoes the specified note from the users favorites in Firestore
 **PARAMS:
 ***token: The authentication token of the user
 ***noteid: The ID  of the note the user wants to favorite
 **RETURNS:
 ***Status: The status of the request. Will be an error if the note was not favorited correctly, either due to server error or due to user error
 ***/
exports.unfavoriteNote = (req, res) => { 
    const favCollection = db.collection("favorites");
    if (req.query.token && req.query.noteid){ //Checks to make sure the note id and token are in the request params.
        admin.auth().verifyIdToken(req.query.token).then(function(decodedToken) { //Admin decodes the token
            const userID = decodedToken.uid; //Get the user id
            const noteID = req.query.noteid; //Get the note id
            db.collection('notes').doc(noteID).get().then(function(doc){
                if (doc.exists){ //If the note id is real
                    favCollection.where("noteid", "==", noteID).where("userid", "==", userID).get().then(function(querySnapshot){
                        querySnapshot.forEach(function(doc){
                            doc.ref.delete();
                        })
                        return res.status(200).json({Status: "Successful"});
                    })
                    .catch(function(error){ //Returns server error if issue looking at the favorites
                        return res.status(500).json({Status: error});
                    });
                   
                }
                else{ //Returns user error if the note doesn't exist
                    return res.status(400).json({Status: "Note not found"});
                }
            })
            
            .catch(function(error){ //Returns server error if fails during retrival of note
                return res.status(500).json({Status: error});
            })
        
        })
        .catch(function(error){ //Returns user error if fails during verification
            return res.status(400).json({Status: error});
        });
    }
    else{ //Returns user error if either the token or note are not there
        return res.status(400).json({Status: "Need both the token and the ID of the note"});
    }
}

/***
 *Has Favorited Note
 **Checks to see if the note if a part of the users favorites in Firestore
 **PARAMS:
 ***token: The authentication token of the user
 ***noteid: The ID  of the note the user wants to favorite
 **RETURNS:
 ***Status: The status of the request. Will be an error if the note was not favorited correctly, either due to server error or due to user error
 ***Favorited: If Status = "Successful", will return whether the user has favorited the note or not
 ***/
exports.hasFavoritedNote = (req, res) => { 
    const favCollection = db.collection("favorites");
    if (req.query.token && req.query.noteid){ //Checks to make sure the note id and token are in the request params.
        admin.auth().verifyIdToken(req.query.token).then(function(decodedToken) { //Admin decodes the token
            const userID = decodedToken.uid; //Get the user id
            const noteID = req.query.noteid;
            db.collection('notes').doc(noteID).get().then(function(doc){
                if (doc.exists){ //If the note id is real
                    favCollection.where("noteid", "==", noteID).where("userid", "==", userID).get().then(function(querySnapshot){
                        if(querySnapshot.empty){
                            return res.status(200).json({Status: "Successful", Favorited: false});
                        }
                        else{ //Returns user error if the user already favorited the note
                            return res.status(200).json({Status: "Successful", Favorited: true});
                        }
                    })
                    .catch(function(error){ //Returns server error if issue looking at the favorites
                        return res.status(500).json({Status: error});
                    });
                   
                }
                else{ //Returns user error if the note doesn't exist
                    return res.status(400).json({Status: "Note not found"});
                }
            })
            
            .catch(function(error){ //Returns server error if fails during retrival of note
                return res.status(500).json({Status: "error"});
            })
        
        })
        .catch(function(error){ //Returns user error if fails during verification
            return res.status(400).json({Status: error});
        });
    }
    else{ //Returns user error if either the token or note are not there
        return res.status(400).json({Status: "Need both the token and the ID of the note"});
    }
}
