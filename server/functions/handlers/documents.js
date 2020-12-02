const { admin, db, bucket } = require('../util/admin');
const { ref } = require('firebase-functions/lib/providers/database');
const fs = require('fs');
const os = require('os');
const Busboy = require('busboy');
const path = require('path');
const { testLab } = require('firebase-functions');
const { response } = require('express');

/***
 *Upload Note
 **Uploads a note to Firebase for a logged in user
 **PARAMS:
 ***token: The authentication token of the user
 **FORM BODY:
 ***file: The file the user wants to upload
 ***name: The name of the note
 ***subject: The subject the note is about
 ***course: The specific course the note is for
 ***term: The term the note was taken for
 ***Insturctor: The instructor the note was taken for
 ***public: Whether or note other users can see the note (true means they can)
 **RETURNS:
 ***Status: The status of the request.
 ***Returns only on Success:
 ****noteID: The Firestore ID of the new note
 ****field: the uploaded form:
 *****file: The file the user wants to upload
 *****name: The name of the note
 *****subject: The subject the note is about
 *****course: The specific course the note is for
 *****term: The term the note was taken for
 *****Insturctor: The instructor the note was taken for
 *****owner: The owner of the note
 *****public: Whether or note other users can see the note (true means they can)
 *****timestamp: The timestamp of the upload
 *****uploader: The user ID of the uploader
 ***/
exports.upload = (req, res) => {
  const busboy = new Busboy({ headers: req.headers }); //Busboy is used to parse the form-data
  const uploads = {}; //Where the form-data is stored
  const idToken = req.query.token; //The token of the user
  var userID = ''; //The user ID that will be received from the user
  var returnval = {}; //Returns the user's form-data after the upload is complete

  //Checks the token to make sure the user is logged in
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(function (decodedToken) {
      userID = decodedToken.uid; //Gets the user ID that will be used to place the file in that user's folder

      console.log('userID1:', userID);

      busboy.end(req.rawBody); //Calls the busboy functions below
    })
    .catch(function (error) {
      return res.status(400).json(error); //Didn't Log in correctly
    });

  //This reads the text fields from the form
  busboy.on('field', function (fieldname, val) {
    returnval[fieldname] = val; //Saves the fields as an object to upload to db.
    console.log('returnval[fieldname]=', returnval[fieldname]);
  });

  //This reads the file fields from the form
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    const filepath = path.join(os.tmpdir(), filename); //Gets the temporary directory that the file will go in
    uploads[fieldname] = { file: filepath, name: filename }; //Add the file to the uploads array
    file.pipe(fs.createWriteStream(filepath)); //Takes the file, reads it, then writes it to the temporary dircetory
  });

  busboy.on('finish', () => {
    for (const name in uploads) {
      const upload = uploads[name]; //Get the object with the file
      const file = upload.file; //Get the file from the object
      const timestamp = admin.firestore.Timestamp.fromDate(new Date());
      const filename = timestamp + upload.name;
      let collection = 'notes';
      console.log('========================>', returnval.public);
      returnval.public.toLowerCase() === 'true'
        ? (collection = 'publicNotes')
        : (collection = 'notes');
      bucket
        .upload(file, { destination: `notes/${userID}/${filename}` }) //Uploads the file to the storage bucket
        .then((data) => {
          console.log('adding to files');

          db.collection('users') //Get the username from Firestore
            .where('userId', '==', userID)
            .get()
            .then(function (snapshot) {
              let owner = '';
              if (snapshot.empty) {
                //If the user does not exist
                return res.status(400).json({ Status: 'User does not exist' });
              }
              snapshot.forEach(function (doc) {
                //Save the username to a variable
                owner = doc.data().username;
              });

              const newNote = {
                //Create the note object that will be uploaded to Firestore
                name: returnval.name,
                filename: filename,
                subject: returnval.subject,
                course: returnval.course,
                term: returnval.term,
                instructor: returnval.instructor,
                owner: owner,
                public: returnval.public,
                uploader: userID,
                timestamp: timestamp,
              };
              db.collection(collection)
                .add(newNote)
                .then(function (uploadDocRef) {
                  //

                  fs.unlinkSync(file); //Unlinks and deletes the file
                  return res.status(200).json({
                    Status: 'Uploaded ',
                    collection: collection,
                    noteID: uploadDocRef.id,
                    field: uploadDocRef.data(),
                  }); //Send the successful response back
                })
                .catch(function (error) {
                  return res.status(500).json({ Status: 'Error Uploading' }); //Problem adding the note to the Firestore
                });
            })
            .catch(function (error) {
              return res.status(500).json({ Status: 'Error getting username' });
            });
        })
        .catch((err) => {
          fs.unlinkSync(file); //Unlinks and deletes the file
          return res.status(500).json(err); //Error uploading to storage
        });
    }
  });
};

/***
 *Preview Note
 **Preview a user's note from Firebase
 **PARAMS:
 ***noteid: The Firestore ID of the note the user wants to preview
 ***Optional Params:
 ****token: The authentication token of the user. Used if the user is logged in, otherwise is ignored
 **RETURNS:
 ***Returns on Success:
 ****The file stream
 ***Returns on Failure:
 ****Status: The status of the request.
 ***/
exports.preview = (req, res) => {
  console.log('hi from preview');
  console.log('noteID:', req.query.noteid);
  console.log('note public', req.query.public);
  let public = req.query.public;
  let collection;
  public.toLowerCase() === 'true'
    ? (collection = 'publicNotes')
    : (collection = 'notes');
  let noteRef = db.collection(collection).doc(req.query.noteid); //Get the reference of the note data from Firestore using the note ID from the request

  var fileDir = ''; //The directory of the file
  var userID = ''; //The ID of the logged in user
  var contentType = 'application/xml'; //The content type of the response that will be sent back
  if (req.query.token) {
    admin
      .auth()
      .verifyIdToken(req.query.token)
      .then(function (decodedToken) {
        //Authenticate the token
        userID = decodedToken.uid; //Get the uid
      })
      .catch(function (error) {
        //Error: Didn't Log in correctly
        return res.status(400).json({ Status: 'Verification Error' });
      });
  }
  noteRef
    .get()
    .then(function (doc) {
      //Get the note data from Firestore
      if (doc.exists) {
        //If the note data was found (I.E. the note ID was correct)
        let noteData = doc.data(); //Put the data in a variable
        const isPublic = noteData.public == 'true'; //Converts from string to boolean
        if (noteData.uploader === userID || isPublic) {
          //Verifies that the user is allowed to view the note (either they created it or it is public)
          let file = bucket.file(
            `notes/${noteData.uploader}/${noteData.filename}`
          ); //Constructs the url from the note data from Firestore

          fileDir = path.join(os.tmpdir(), noteData.filename); //Get the location of the temporary directory to place the file
          file
            .createReadStream()
            .on('error', function (err) {
              return res.status(500).json({ Status: err }); //Error reading the file
            })
            .on('response', function (response) {
              contentType = response.headers['content-type']; //Get the type of file that it is
            })
            .on('end', function () {
              //Finished writing the file
              fs.readFile(fileDir, function (err, data) {
                //Read the file
                res.contentType(contentType); //Get the content-type (what kind of file it is) and include in the response
                res.send(data); //Send the data
                fs.unlinkSync(fileDir); //Unlink and delete the file
              });
            })
            .pipe(fs.createWriteStream(fileDir)); //Start the write stream
        } else {
          //Error: The note is not public and the user is not authorized to see it
          return res.status(404).json({ Status: 'Not Found' });
        }
      } else {
        //Error: Note does not exist
        return res.status(404).json({ Status: 'Not Found' });
      }
    })
    .catch(function (error) {
      //Error: Server couldn't get the document
      return res.status(500).json({ Error: error });
    });
};

/***
 *User List
 **Gets the user's list of uploaded notes
 **PARAMS:
 ***token: The authentication token of the user
 ***noteid: The Firestore ID of the note the user wants to edit
 **RETURNS:
 ***Status: The status of the request.
 ***Returns only on Success:
 ****List of Notes: The user's list of notes:
 *****uploader: The Firebase ID of the user
 *****filename: The name of the file in Firebase's Storage
 *****name: The name of the note
 *****subject: The subject the note is about
 *****course: The specific course the note is for
 *****term: The term the note was taken for
 *****Insturctor: The instructor the note was taken for
 *****owner: The owner of the note
 *****public: Whether or note other users can see the note (true means they can)
 *****timestamp: The time the note was uploaded
 *****noteID: The Firestore ID of the new note
 ***/
exports.userList = (req, res) => {
  console.log('hi from user list');
  const token = req.query.token; //Get the token from the request
  console.log('token:', token);
  var retList = []; //The array of note data that will be returned
  if (token) {
    //If the token exists
    admin
      .auth()
      .verifyIdToken(token)
      .then(function (decodedToken) {
        //Authenticate the token
        var userID = decodedToken.uid; //Get the uid
        var notesRef = db.collection('notes'); //The collection of note data
        notesRef
          .where('uploader', '==', userID)
          .get() //Queries the collection based on the user ID
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              //Loop through each result
              var addDoc = doc.data(); //Get the data
              addDoc['noteID'] = doc.id; //Add the note ID to the object
              retList.push(addDoc); //Push the object to the returned array
            });
            console.log('sending list back:', retList);

            // here check another collection
            db.collection('publicNotes')
              .where('uploader', '==', userID)
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  //Loop through each result
                  var addDoc = doc.data(); //Get the data
                  addDoc['noteID'] = doc.id; //Add the note ID to the object
                  retList.push(addDoc); //Push the object to the returned array
                });
                return res.status(200).json({ retList }); //Send the array back
              });
          })
          .catch(function (error) {
            //Error: Server isse with getting the documents
            return res.status(500).json({ Status: error });
          });
      })
      .catch(function (error) {
        //Error: Issue verifying the token
        return res.status(500).json({ Status: 'Verification Error' }); //Didn't Log in correctly
      });
  } else {
    //Error: No token was sent or the token was sent incorrectly (wrong query name, etc.)
    return res.status(400).json({ Status: 'No Token Sent' });
  }
};
/***
 *Edit Note
 **Edits a note's data in Firebase for a logged in user
 **PARAMS:
 ***token: The authentication token of the user
 ***noteid: The Firestore ID of the note the user wants to edit
 **JSON BODY:
 ***file: The file the user wants to upload
 ***name: The name of the note
 ***subject: The subject the note is about
 ***course: The specific course the note is for
 ***term: The term the note was taken for
 ***Insturctor: The instructor the note was taken for
 ***owner: The owner of the note
 ***public: Whether or note other users can see the note (true means they can)
 **RETURNS:
 ***Status: The status of the request.
 ***Returns only on Success:
 ****noteID: The Firestore ID of the new note
 ***/
exports.editNote = (req, res) => {
  const token = req.query.token; //Get the token from the request
  const noteID = req.query.noteid; //Get the note ID from the request
  const public = req.query.public;
  let collection;
  public.toLowerCase() === 'true'
    ? (collection = 'publicNotes')
    : (collection = 'notes');
  const newPublic = req.body.public;
  let newCollection;
  newPublic.toLowerCase() === 'true'
    ? (newCollection = 'publicNotes')
    : (newCollection = 'notes');

  if (token && noteID) {
    //Make sure we got both the note ID and the token
    admin
      .auth()
      .verifyIdToken(token)
      .then(function (decodedToken) {
        //Verify the token is valid
        var userID = decodedToken.uid; //Get the user ID
        db.collection(collection)
          .doc(noteID)
          .get()
          .then(function (doc) {
            //Get the document
            if (doc.exists) {
              //If the note exists
              if (doc.data().uploader === userID) {
                //Make sure the user editing the note is the same user who uploaded it

                const newNote = {
                  //Create a new note to replace the old note
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
                if (collection === newCollection) {
                  db.collection(collection)
                    .doc(noteID)
                    .update(newNote)
                    .then(function (updatedDoc) {
                      //Update the document
                      return res
                        .status(200)
                        .json({ Status: 'Successful', noteID: noteID });
                    })
                    .catch(function (error) {
                      //Error: Issue updating the document
                      return res
                        .status(500)
                        .json({ Status: 'Error Updating Doc' });
                    });
                } else {
                  db.collection(newCollection)
                    .doc(noteID)
                    .create(newNote)
                    .then(function (updatedDoc) {
                      //Update the document
                      db.collection(collection)
                        .doc(noteID)
                        .delete()
                        .then(function () {
                          return res
                            .status(200)
                            .json({ Status: 'Successful', noteID: noteID });
                        })
                        .catch(function (error) {
                          return res
                            .status(500)
                            .json({ Status: 'Error Changing Public' });
                        });
                    })
                    .catch(function (error) {
                      //Error: Issue updating the document
                      return res
                        .status(500)
                        .json({ Status: 'Error Updating Doc', error: error });
                    });
                }
              } else {
                //Error: User is not the original owner
                return res.status(400).json({ Status: 'Not Authorized' });
              }
            } else {
              //Error: Note not found
              return res.status(400).json({ Status: 'Note Not Found' });
            }
          })
          .catch(function (error) {
            //Error: Server issue getting the document
            res.status(500).json({ Status: 'Error getting doc' });
          });
      })
      .catch(function (error) {
        //Error: Server issue decoding token
        res.status(500).json({ Status: error });
      });
  } else {
    //Error: User forgot token and/or note ID
    return res.status(400).json({ Status: 'Token and/or Note ID is missing' });
  }
};

/***
 *Delete Note
 **Deletes a user's note from Firebase
 **PARAMS:
 ***token: The authentication token of the user
 ***noteid: The Firestore ID of the note the user wants to delete
 **RETURNS:
 ***Status: The status of the request.
 ***/
exports.deleteNote = (req, res) => {
  const token = req.query.token;
  console.log('hi from delete');
  console.log('noteID: ', req.query.noteid);
  console.log('token:', req.query.token);
  console.log('public', req.query.public_status);
  let collection = '';
  req.query.public_status.toLowerCase() === 'true'
    ? (collection = 'publicNotes')
    : (collection = 'notes');
  console.log('deleting from ', collection);
  const noteRef = db.collection(collection).doc(req.query.noteid); //Get the reference of the note data from Firestore using the note ID from the request
  var userID = ''; //The ID of the logged in user
  if (req.query.token) {
    admin
      .auth()
      .verifyIdToken(req.query.token)
      .then(function (decodedToken) {
        //Authenticate the token
        userID = decodedToken.uid; //Get the uid
      })
      .catch(function (error) {
        return res.status(400).json({ Status: 'Verification Error' }); //Didn't Log in correctly
      });
    noteRef
      .get()
      .then(function (doc) {
        //Get the note data from Firestore
        if (doc.exists) {
          //If the note data was found (I.E. the note ID was correct)
          console.log('doc found');
          noteData = doc.data(); //Put the data in a variable
          if (noteData.uploader === userID) {
            //Verifies that the user is allowed to delete the note
            //delete file from storage
            bucket
              .file(`notes/${noteData.uploader}/${noteData.filename}`)
              .delete()
              .then(function () {
                // delete from notes/publicNotes
                noteRef
                  .delete()
                  .then(function () {
                    console.log('DELETED');
                    // // check if notes was in favorites
                    // db.collection('favorites').where('noteid', '==', noteID).get()
                    //   .then(qS => {
                    //     console.log('checking favorites')
                    //     if (qS.empty) {
                    //       console.log('not is not anybodies favorite')
                    //       return res.status(200).json({ Status: 'Delete Successful' });
                    //     }
                    //     else {
                    //       console.log('deleting from favorites')
                    //       qS.forEach(doc => {
                    //         doc.ref.delete()
                    //         return res.status(200).json({ Status: 'Delete Successful' });
                    //       })
                    //     }
                    //   })

                    return res
                      .status(200)
                      .json({ Status: 'Delete Successful' });
                  })
                  .catch(function (error) {
                    return res.status(500).json({ Status: error });
                  });
              })
              .catch(function (error) {
                return res.status(500).json({ Status: error });
              });
          } else {
            return res.status(404).json({ Status: 'Not Authorized' });
          }
        } else {
          return res.status(404).json({ Status: 'Not Found' });
        }
      })
      .catch(function (error) {
        return res.status(500).json({ Error: error });
      });
  } else {
    return res.status(400).json({ Error: 'No Token was Sent' });
  }
};

/***
 *Favorite Note
 **Saves the users favorites to Firestore
 **PARAMS:
 ***token: The authentication token of the user
 ***noteid: The ID  of the note the user wants to favorite
 ***public: If the note is public or not
 **RETURNS:
 ***Status: The status of the request. Will be an error if the note was not favorited correctly, either due to server error or due to user error
 ***/
exports.favoriteNote = (req, res) => {
  const favCollection = db.collection('favorites');
  const public = req.body.public;
  let collection;
  public.toLowerCase() === 'true'
    ? (collection = 'publicNotes')
    : (collection = 'notes');
  if (req.body.token && req.body.noteid) {
    //Checks to make sure the note id and token are in the request params.
    admin
      .auth()
      .verifyIdToken(req.body.token)
      .then(function (decodedToken) {
        //Admin decodes the token
        const userID = decodedToken.uid; //Get the user id
        const noteID = req.body.noteid;
        db.collection(collection)
          .doc(noteID)
          .get()
          .then(function (doc) {
            if (doc.exists) {
              //If the note id is real
              favCollection
                .where('noteid', '==', noteID)
                .where('userid', '==', userID)
                .get()
                .then(function (querySnapshot) {
                  if (querySnapshot.empty) {
                    const newFav = {
                      //Create a new favorite object to add to Firestore with the user id, note id, and current datetime
                      userid: userID,
                      noteid: noteID,
                      timestamp: admin.firestore.Timestamp.fromDate(new Date()),
                      public: public,
                    };
                    favCollection
                      .add(newFav)
                      .then(function (favRef) {
                        //Adds the favorite to firestore and returns a successful response
                        return res.status(200).json({ Status: 'Successful' });
                      })
                      .catch(function (error) {
                        //Returns server error if fails during favorite upload
                        return res.status(500).json({ Status: error });
                      });
                  } else {
                    //Returns user error if the user already favorited the note
                    return res
                      .status(400)
                      .json({ Status: 'User already favoirted the note' });
                  }
                })
                .catch(function (error) {
                  //Returns server error if issue looking at the favorites
                  return res.status(500).json({ Status: error2 });
                });
            } else {
              //Returns user error if the note doesn't exist
              return res.status(400).json({ Status: 'Note not found' });
            }
          })

          .catch(function (error) {
            //Returns server error if fails during retrival of note
            return res.status(500).json({ Status: error });
          });
      })
      .catch(function (error) {
        //Returns user error if fails during verification
        return res.status(400).json({ Status: error });
      });
  } else {
    //Returns user error if either the token or note are not there
    return res
      .status(400)
      .json({ Status: 'Need both the token and the ID of the note' });
  }
};

/***
 *Unfavorite Note
 **Remvoes the specified note from the users favorites in Firestore
 **PARAMS:
 ***token: The authentication token of the user
 ***noteid: The ID  of the note the user wants to favorite
 ***public: If the note is public or not
 **RETURNS:
 ***Status: The status of the request. Will be an error if the note was not favorited correctly, either due to server error or due to user error
 ***/
exports.unfavoriteNote = (req, res) => {
  const favCollection = db.collection('favorites');
  const public = req.query.public;
  let collection;
  public.toLowerCase() === 'true'
    ? (collection = 'publicNotes')
    : (collection = 'notes');
  if (req.query.token && req.query.noteid) {
    //Checks to make sure the note id and token are in the request params.
    admin
      .auth()
      .verifyIdToken(req.query.token)
      .then(function (decodedToken) {
        //Admin decodes the token
        const userID = decodedToken.uid; //Get the user id
        const noteID = req.query.noteid; //Get the note id
        db.collection(collection)
          .doc(noteID)
          .get()
          .then(function (doc) {
            if (doc.exists) {
              //If the note id is real
              favCollection
                .where('noteid', '==', noteID)
                .where('userid', '==', userID)
                .get()
                .then(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    doc.ref.delete();
                  });
                  return res.status(200).json({ Status: 'Successful' });
                })
                .catch(function (error) {
                  //Returns server error if issue looking at the favorites
                  return res.status(500).json({ Status: error });
                });
            } else {
              //Returns user error if the note doesn't exist
              return res.status(400).json({ Status: 'Note not found' });
            }
          })

          .catch(function (error) {
            //Returns server error if fails during retrival of note
            return res.status(500).json({ Status: error });
          });
      })
      .catch(function (error) {
        //Returns user error if fails during verification
        return res.status(400).json({ Status: error });
      });
  } else {
    //Returns user error if either the token or note are not there
    return res
      .status(400)
      .json({ Status: 'Need both the token and the ID of the note' });
  }
};

/***
 *Has Favorited Note
 **Checks to see if the note if a part of the users favorites in Firestore
 **PARAMS:
 ***token: The authentication token of the user
 ***noteid: The ID  of the note the user wants to favorite
 ***public: If the note is public or not
 **RETURNS:
 ***Status: The status of the request. Will be an error if the note was not favorited correctly, either due to server error or due to user error
 ***Favorited: If Status = "Successful", will return whether the user has favorited the note or not
 ***/
exports.hasFavoritedNote = (req, res) => {
  const favCollection = db.collection('favorites');
  const public = req.query.public;
  let collection;
  public.toLowerCase() === 'true'
    ? (collection = 'publicNotes')
    : (collection = 'notes');
  if (req.query.token && req.query.noteid) {
    //Checks to make sure the note id and token are in the request params.
    admin
      .auth()
      .verifyIdToken(req.query.token)
      .then(function (decodedToken) {
        //Admin decodes the token
        const userID = decodedToken.uid; //Get the user id
        const noteID = req.query.noteid;
        db.collection(collection)
          .doc(noteID)
          .get()
          .then(function (doc) {
            if (doc.exists) {
              //If the note id is real
              favCollection
                .where('noteid', '==', noteID)
                .where('userid', '==', userID)
                .get()
                .then(function (querySnapshot) {
                  if (querySnapshot.empty) {
                    return res
                      .status(200)
                      .json({ Status: 'Successful', Favorited: false });
                  } else {
                    //Returns user error if the user already favorited the note
                    return res
                      .status(200)
                      .json({ Status: 'Successful', Favorited: true });
                  }
                })
                .catch(function (error) {
                  //Returns server error if issue looking at the favorites
                  return res.status(500).json({ Status: error });
                });
            } else {
              //Returns user error if the note doesn't exist
              return res.status(400).json({ Status: 'Note not found' });
            }
          })

          .catch(function (error) {
            //Returns server error if fails during retrival of note
            return res.status(500).json({ Status: 'error' });
          });
      })
      .catch(function (error) {
        //Returns user error if fails during verification
        return res.status(400).json({ Status: error });
      });
  } else {
    //Returns user error if either the token or note are not there
    return res
      .status(400)
      .json({ Status: 'Need both the token and the ID of the note' });
  }
};

/***
 *Favorites List
 **Returns a list of notes the user has favorited
 **PARAMS:
 ***token: The authentication token of the user
 **RETURNS:
 ***Status: The status of the request.
 ***List: If Status = "Successful", will return whether the list of notes the user has favorited
 ***/

exports.favoriteList = (req, res) => {
  console.log('hi from favoriteList');
  const favCollection = db.collection('favorites');
  const noteCollection = db.collection('notes');
  const publicCollection = db.collection('publicNotes');
  let testCollection;
  console.log('res.query.public_status', req.query.public_status);
  req.query.public_status === 'true'
    ? (testCollection = publicCollection)
    : (testCollection = noteCollection);
  var retList = [];
  var idArray = [];
  if (req.query.token) {
    //Checks to make sure the note id and token are in the request params.
    admin
      .auth()
      .verifyIdToken(req.query.token)
      .then(function (decodedToken) {
        //Admin decodes the token
        const userID = decodedToken.uid; //Get the user id
        console.log('userID:', userID);

        favCollection
          .where('userid', '==', userID)
          .where('public', '==', req.query.public_status)
          .get()
          .then(function (querySnapshot) {
            if (querySnapshot.empty) {
              console.log('snapshot is empty');
              return res.status(200).json({ Status: 'Successful', List: [] });
            } else {
              console.log('snapshot is NOT empty');
              querySnapshot.forEach(function (doc) {
                //Loop through each favorite object and save the note ID
                idArray.push(doc.data().noteid);
              });
              console.log('idArray', idArray);

              var promises = idArray.map(function (noteID) {
                return testCollection.doc(noteID).get();
              }); //Use this to execute multiple queries

              Promise.all(promises)
                .then(function (snapshots) {
                  //Loop through each get query
                  snapshots.forEach(function (noteDoc) {
                    //Loop through each result
                    var addDoc = noteDoc.data(); //Get the data
                    // typeof addDoc === 'undefined' ? console.log('need to look in public notes') : ''

                    addDoc['noteID'] = noteDoc.id; //Add the note ID to the object
                    retList.push(addDoc); //Push the object to the returned array
                  });
                  console.log('sending favorits list2:', retList);
                  return res
                    .status(200)
                    .json({ Status: 'Successful', List: retList });
                })
                .catch(function (error) {
                  //Error executing the promises
                  return res.status(500).json({ Status: error });
                });
            }
          })
          .catch(function (error) {
            //Returns server error if issue looking at the favorites
            return res.status(500).json({ Status: error });
          });
      })

      .catch(function (error) {
        return res.status(400).json({ Status: 'Need Valid Token' });
      });
  } else {
    //Returns user error if either the token or note are not there
    return res.status(400).json({ Status: 'Need a Token' });
  }
};

// exports.favoriteList = (req, res) => {
//   console.log('hi from favoriteList')
//   const favCollection = db.collection("favorites");
//   const noteCollection = db.collection("notes");
//   const publicCollection = db.collection("publicNotes");
//   var retList = [];
//   var idArray = [];
//   if (req.query.token) { //Checks to make sure the note id and token are in the request params.
//     admin.auth().verifyIdToken(req.query.token)
//       .then(function (decodedToken) { //Admin decodes the token
//         const userID = decodedToken.uid; //Get the user id
//         console.log('userID:', userID)

//         // get snapshot for a user
//         favCollection.where("userid", "==", userID).get()
//           .then(function (querySnapshot) {
//             if (querySnapshot.empty) {
//               console.log('snapshot is empty')
//               return res.status(200).json({ Status: "Successful", List: [] });
//             }
//             else {
//               const returnPub = async () => {
//                 let retPub = await getListOfFavorites(userID, 'true', publicCollection)
//                 console.log(retPub)
//               }
//               // console.log('snapshot is not empty')
//               // getListOfFavorites(userID, public, publicCollection)
//               //   .then((retList) => {
//               //     console.log('returning', retList)
//               //     return res.status(200).json({ Status: "Successful", List: retList });
//               //   })
//             }
//           })
//           .catch(function (error) { //Returns server error if issue looking at the favorites
//             return res.status(500).json({ Status: error });
//           })

//       })

//       .catch(function (error) {
//         return res.status(400).json({ Status: "Need Valid Token" });
//       })
//   }
//   else { //Returns user error if either the token or note are not there
//     return res.status(400).json({ Status: "Need a Token" });
//   }

// }

// const getListOfFavorites = async (userID, public, collection) => {
//   console.log('helper is called')
//   const favCollection = db.collection("favorites");
//   favCollection.where("userid", "==", userID).where('public', '==', public).get()
//     .then(function (querySnapshot) {
//       if (querySnapshot.empty) {
//         console.log('snapshot is empty')
//         return res.status(200).json({ Status: "Successful", List: [] });
//       }
//       else {
//         console.log('snapshot is NOT empty')
//         querySnapshot.forEach(function (doc) { //Loop through each favorite object and save the note ID
//           idArray.push(doc.data().noteid);
//         })
//         console.log('idArray', idArray)
//         let promises = idArray.map(function (noteID) {
//           console.log('getting public promises')
//           return collection.doc(noteID).get()
//         });
//         Promise.all(promises).then(function (snapshots) { //Loop through each get query
//           snapshots.forEach(function (noteDoc) { //Loop through each result
//             // console.log('noteDoc', noteDoc)
//             console.log('GETTING DATA')
//             var addDoc = noteDoc.data(); //Get the data
//             console.log('addDoc', addDoc)
//             console.log('idArray', idArray)
//             typeof addDoc === 'undefined' ? console.log('need to look in public notes') : ''

//             addDoc['noteID'] = noteDoc.id; //Add the note ID to the object
//             retList.push(addDoc); //Push the object to the returned array
//           })
//           console.log('sending favorits list2:', retList)
//           //return res.status(200).json({ Status: "Successful", List: retList });
//           return retList
//         })
//           .catch(function (error) { //Error executing the promises
//             // return res.status(500).json({ Status: error });
//             return []
//           })
//       }
//     })

// }
