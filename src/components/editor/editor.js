import EditorJs from 'react-editor-js';
import { EDITOR_JS_TOOLS } from "./tools";
import React from 'react';
import Sidebar from "../Layout/Sidebar";
import Paper from '@material-ui/core/Paper';

function myEditor() {

    let editorButtons = ['Upload', 'New Note', 'Download']
    return (
        <div>
            <div style={{ display: 'flex' }} >
                <Sidebar buttons={editorButtons}></Sidebar>
                <Paper elevation={20} style={{ width: '700px' }}>
                    <EditorJs
                        tools={EDITOR_JS_TOOLS}
                        autofocus
                        placeholder="Add content here..."
                        onChange={(data) => { this.data = data }}
                        onReady={() => console.log('Start typing!')}
                    />
                </Paper >
            </div>
        </div>
    )
}
export default myEditor;
