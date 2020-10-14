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
        }).catch(function (error) {//Error: Didn't Log in correctly
            return res.status(400).json({Status: "Verification Error"}); 
        })
    }
    noteRef.get().then(function(doc){ //Get the note data from Firestore
        if (doc.exists){ //If the note data was found (I.E. the note ID was correct)
            noteData = doc.data(); //Put the data in a variable
            const isPublic = (noteData.public == 'true'); //Converts from string to boolean
            if (noteData.uploader === userID || isPublic){ //Verifies that the user is allowed to view the note (either they created it or it is public)
                file = bucket.file(`notes/${noteData.uploader}/${noteData.filename}`); //Constructs the url from the note data from Firestore
                
                fileDir = path.join(os.tmpdir(), noteData.filename); //Get the location of the temporary directory to place the file
                file.createReadStream()
                .on('error', function(err){
                    return res.status(500).json({Status: err}); //Error reading the file
                })
                .on('response', function(response) {
                    contentType = response.headers['content-type']; //Get the type of file that it is
                })
                .on('end', function() { //Finished writing the file
                    fs.readFile(fileDir, function (err, data){ //Read the file
                        res.contentType(contentType); //Get the content-type (what kind of file it is) and include in the response
                        res.send(data); //Send the data
                        fs.unlinkSync(fileDir); //Unlink and delete the file
                    });
                })
                .pipe(fs.createWriteStream(fileDir)); //Start the write stream
        }
            else{ //Error: The note is not public and the user is not authorized to see it
                 return res.status(404).json({Status: "Not Found"});
            }
        }
        else{ //Error: Note does not exist
            return res.status(404).json({Status: "Not Found"});
        }
    }).catch(function(error){ //Error: Server couldn't get the document
        return res.status(500).json({Error: error});
    })
    
}

exports.userList = (req, res) => {
    const token = req.query.token; //Get the token from the request
    var retList = []; //The array of note data that will be returned
    if (token){ //If the token exists
        admin.auth().verifyIdToken(token).then(function(decodedToken){ //Authenticate the token
            var userID = decodedToken.uid; //Get the uid
            var notesRef = db.collection('notes'); //The collection of note data
            notesRef.where('uploader', '==', userID).get() //Queries the collection based on the user ID
                .then(function(querySnapshot){
                    querySnapshot.forEach(function(doc) { //Loop through each result
                        var addDoc = doc.data(); //Get the data
                        addDoc['noteID'] = doc.id; //Add the note ID to the object
                        retList.push(addDoc); //Push the object to the returned array
                    });
                    return res.status(200).json(retList); //Send the array back
                    })
                    .catch(function(error) { //Error: Server isse with getting the documents
                        return res.status(500).json({Status: error});
                    })
        }).catch(function (error) { //Error: Issue verifying the token
            return res.status(500).json({Status: "Verification Error"}); //Didn't Log in correctly
        });
    }
    else{ //Error: No token was sent or the token was sent incorrectly (wrong query name, etc.)
        return res.status(400).json({Status: "No Token Sent"});
    }
    
}

