import React, { Component } from 'react'
import NotesList from "../Layout/NotesList"
import Sidebar from "../Layout/Sidebar";
import "./personalSpace.css";

export default class PersonalSpace extends Component {

    render() {
        let pwButtons = ['Upload', 'New Note']
        return (
            <div className="app__page">
                <Sidebar buttons={pwButtons}></Sidebar>
                <div className="personalSpace">
                    <NotesList></NotesList>
                </div>
            </div>
        )

    }
}
