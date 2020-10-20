import React from "react";
import DisplayNots from "../NotesList/displayNotes"
import Sidebar from "../Sidebar/Sidebar";
import "./personalSpace.css";

function PersonalSpace(){

return(
<div className="app__page">
    <Sidebar></Sidebar>

        <div className="personalSpace">
       <DisplayNots></DisplayNots>
        <div className="personalSpace">
            <br></br>
            <br></br>
            <br></br>
        </div>
        
</div>
</div>
)

}
export default PersonalSpace
