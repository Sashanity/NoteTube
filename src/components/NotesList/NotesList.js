import React from 'react';
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
    },
    {
        "owner": "sashanity",
        "name": "mylecture",
        "term": "fall2020",
        "instructor": "werber",
        "uploader": "kAswU2od7yeFReIOn1gcnUItUrz2",
        "timestamp": {
            "_seconds": 1604644106,
            "_nanoseconds": 543000000
        },
        "course": "cmpe189",
        "subject": "cs",
        "public": "false",
        "filename": "lec1-2.pdf",
        "noteID": "ijzH0HSUlmOxnyP5eALz"
    }
]
function displayNotes() {
    console.log('IN DISPLAY NOTES');

    let notesArr = getUserNotes()
    console.log('notes array', test)
    let output = test.map(item =>

        < NotesListItem
            key={item.noteID} // unique key for each element
            Notes_title={item.name}
            courseName={item.course}
            semester={item.term}
            // timestamp={item.timestamp} //  figure outhow to convert to Date
            instructor={item.instructor}
            subject={item.subject}
        >
        </NotesListItem >)
    console.log('output', output)

    return (
        <div className="NotesListItem">
            <h2>List of Notes</h2>
            <div className="PublicNotes">
                {output}

                {/* <NotesListItem
                    Notes_title="Intro To Database"
                    courseName="CS 157A"
                    semester="Fall 2019"
                    timestamp="15 September 2019"
                    instructor="John Smith"
                    subject="Computer Science"
                >
                </NotesListItem> */}
            </div>
        </div>
    )
}
export default displayNotes