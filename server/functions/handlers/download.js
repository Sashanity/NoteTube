
const { db, bucket } = require('../util/admin');
const firebase = require('firebase');


exports.download = (req, res) => {
    let noteObj = db.collection('notes-url').doc(req.query.noteid);
    // var fileDir = "";
    console.log("note id:", req.query.noteid)
    noteObj.get().then((doc) => {
        const noteData = doc.data();
        const filename = noteData.filename;
        console.log("note filename associated:", filename);

        let user = firebase.auth().currentUser;
        let userId

        if (user) {
            userId = user.uid
        } else {
            userId = "not found"
        }
        console.log("UserId:", userId)
        // const bucketName = 'notetube-f3f9c.appspot.com';
        // notes/userid/filename
        const srcFilename = `notes/${userId}/${filename}`;
        const destFilename = `./${filename}`;


        async function downloadFile() {
            const options = {
                // The path to which the file should be downloaded, e.g. "./file.txt"
                destination: destFilename,
            };

            //     // Downloads the file
            await bucket.file(srcFilename).download(options);

            // console.log(
            //     `gs://${bucketName}/${srcFilename} downloaded to ${destFilename}.`
            // );
        }

        downloadFile().catch(console.error);


        res.status(200).json({ Status: "Doc found", data: noteData });
    })



    //return res.status(200).json({ Status: "Found"})
}