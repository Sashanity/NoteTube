import React, { useState, useEffect } from 'react';
import './NotesListItem.css';
import NotesListItem from './NotesListItem';
import { getUserNotes } from '../../actions/documents';


const NotesList = () => {
    const [notes, setNotes] = useState();
    const returningNotes = async() =>{
        try{
            let notes = await getUserNotes()
            console.log('RECEIVED LIST OF NOTES:', notes)
            setNotes(notes.map(item =>                
                < NotesListItem
                    key={item.noteID} // unique key for each element
                    noteID={item.noteID}
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