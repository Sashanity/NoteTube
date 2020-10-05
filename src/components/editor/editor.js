import EditorJs from 'react-editor-js';
import { EDITOR_JS_TOOLS } from "./tools";
import React, { Component } from 'react';
import Sidebar from "../Layout/Sidebar";
import Paper from '@material-ui/core/Paper';

import jsPDF from 'jspdf'
let data = {
    "time": 1554920381017,
    "blocks": [
        {
            "type": "header",
            "data": {
                "text": "Hello Editor.js",
                "level": 2
            }
        },
        {
            type: "paragraph",
            data: {
                text:
                    "We have been working on this project more than three years. Several large media projects help us to test and debug the Editor, to make it's core more stable. At the same time we significantly improved the API. Now, it can be used to create any plugin for any task. Hope you enjoy."
            }
        },
    ],
    "version": "2.12.4"
}
let jsPdfGenerator = (data) => {
    var doc = new jsPDF('p', 'mm', [297, 210]); // creates A4 format page
    doc.setFont('Roboto-Regular');
    doc.setTextColor(255, 0, 0)

    data.blocks.forEach((block, i) => {
        block.type === "header" ? doc.setFontSize(30) : doc.setFontSize(10)
        var splitText = doc.splitTextToSize(block.data.text, 180);
        doc.text(10, 10 + (i * 10), splitText)
    })
    doc.save('editor.pdf');
}

class myEditor extends Component {
    render() {
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
                            onChange={(data) => { console.log("SAVING this:", data) }}
                            onReady={() => console.log('Start typing!')}
                        />
                    </Paper >
                </div>
                {/* <button onClick={jsPdfGenerator(this.currentData)}>save</button> */}

            </div>

        )
    }
}
export default myEditor;
