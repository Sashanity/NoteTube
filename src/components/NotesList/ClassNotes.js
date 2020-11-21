import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import SelectedListItem from "./listofItems";
import "./NotesListItem.css"
import MoreVertIcon from '@material-ui/icons/MoreVert';


function ClassNotes(props) {
    const {key} = props
    const [edit, detele] = useState(false);

    const editNotes = () => (edit ? detele(false) : detele(true));

    return (

        <div>
            <IconButton aria-label="settings" onClick={editNotes} className="listofitems">
                <MoreVertIcon >
                </MoreVertIcon>

            </IconButton>
            {edit ? <div style={{ position: "absolute", zIndex: 10 }}><SelectedListItem noteID={key}></SelectedListItem></div> : null}
        </div>

    )
}

export default ClassNotes