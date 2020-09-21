import React from "react";
import NotesList from "../Layout/NotesList"
import Sidebar from "../Layout/Sidebar";
import "./personalSpace.css";

function PersonalSpace(){

return(
<div className="app__page">
    <Sidebar></Sidebar>

        <div className="personalSpace">
        <NotesList></NotesList>
            
        
</div>
</div>
)

}
export default PersonalSpace
