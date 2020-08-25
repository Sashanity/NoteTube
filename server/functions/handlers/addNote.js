const { db, admin } = require('../util/admin');

exports.addNote = (req, res) => {
    const newNote = {
        filename: req.body.filename,
        course: req.body.course,
        term: req.body.term,
        instructor: req.body.instructor,
        owner: req.body.owner,
        public: req.body.public,
        // this should come from the storage
        docURL: req.body.docURL,
        timestamp: admin.firestore.Timestamp.fromDate(new Date()),
    };

    db.collection('notes2').add(newNote)
        .then(() => {
            return res.json({ message: 'Note added successfully' });
        })
}




