import React, { useState, useEffect } from 'react';
import './NotesListItem.css';
import NotesListItem from './NotesListIem';
import { getUserNotes } from '../../actions/documents';

let test = [
    {
        "course": "cmpe188",
        "name": "mylecture",
        "usersFavorited": [],
        "term": "fall2021",
        "public": "false",
        "uploader": "kAswU2od7yeFReIOn1gcnUItUrz2",
        "owner": "sashanity",
        "timestamp": {
            "_seconds": 1603321496,
            "_nanoseconds": 753000000
        },
        "subject": "cs",
        "filename": "lec1-2.pdf",
        "instructor": "wer",
        "noteID": "99yv1rpYvBEnaj4lgjMm"
    }

]
const NotesList = () => {
    const [notes, setNotes] = useState();
    let output
    const returningNotes = async() =>{
        try{
            let notes = await getUserNotes()
            setNotes(notes.map(item =>
                < NotesListItem
                    key={item.noteID} // unique key for each element
                    Notes_title={item.name}
                    courseName={item.course}
                    semester={item.term}
                    // timestamp={item.timestamp} //  figure outhow to convert to Date
                    instructor={item.instructor}
                    subject={item.subject}
                >
                </NotesListItem >))
        }
        catch (err){
            return err;
        }
    }
    useEffect(() => {
        returningNotes()
    },[])
    return (
        <div className="NotesListItem">
            <h2>List of Notes</h2>
            <div className="PublicNotes">
                {notes}
            </div>
        </div>
    )
}
export default NotesList