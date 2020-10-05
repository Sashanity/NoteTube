import EditorJs from 'react-editor-js';
import { EDITOR_JS_TOOLS } from "./tools";
import React, { Component } from 'react';
import Sidebar from "../Layout/Sidebar";
import Paper from '@material-ui/core/Paper';

class myEditor extends Component {
    render() {
        let editorButtons = ['Upload', 'New Note', 'Download']
        return (
            <div style={{ display: 'flex' }} >
                <Sidebar buttons={editorButtons}></Sidebar>
                <Paper elevation={20} style={{ width: '700px' }}>
                    <EditorJs
                        tools={EDITOR_JS_TOOLS}
                        autofocus
                        placeholder="Add content here..."
                        onChange={(data) => console.log(data)}
                        onReady={() => console.log('Start typing!')}
                    />
                </Paper >
            </div>
        )
    }
}
export default myEditor;
