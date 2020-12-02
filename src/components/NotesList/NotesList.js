import React, { useState, useEffect } from 'react';
import './NotesListItem.css';
import NotesListItem from './NotesListItem';
import { getUserNotes } from '../../actions/documents';
import MoodIcon from '@material-ui/icons/Mood';
import { getFavorites } from '../../actions/favorites';

export default function NotesList(props) {

  let val
  const { notelistName } = props
  const [notes, setNotes] = useState();
  const returningNotes = async () => {
    try {
      notelistName === 'userNotes' ? console.log('CALL USERNOTES') : console.log('CALL FAVORITES')
      let notes

      if (notelistName === 'userNotes') {

        notes = await getUserNotes()
        val = 'notes'

      }
      else if (notelistName === 'userFavorites') {
        notes = await getFavorites();
        val = 'favorites'
      }
      console.log('NOTES LIST NAME=', notelistName)
      console.log('RECEIVED LIST OF NOTES:', notes);
      setNotes(
        notes.map((item) => (
          <NotesListItem
            key={item.noteID} // unique key for each element
            noteID={item.noteID}
            public_status={item.public}
            Notes_title={item.name}
            courseName={item.course}
            semester={item.term}
            // timestamp={item.timestamp} //  figure outhow to convert to Date
            instructor={item.instructor}
            subject={item.subject}
            setNotes={returningNotes}
          ></NotesListItem>
        ))
      );
    } catch (err) {
      return err;
    }
  };
  useEffect(() => {
    returningNotes();
  }, []);
  return (
    <div className='NotesListItem'>
      {/* <h2>List of your Notes</h2> */}
      {/* <ScrollableTabsButtonForce ></ScrollableTabsButtonForce> */}
      <div className='PublicNotes'>
        {notes && notes.length ? (
          notes
        ) : (
            <p>

              You do not have any  {notelistName === 'userNotes' ? 'notes' : 'favorites'} yet <MoodIcon></MoodIcon>
            </p>
          )}
      </div>
    </div >
  );
};
// export default NotesList;
