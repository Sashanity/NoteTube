
import React from 'react'
import { Component } from 'react';
// import EditorJs from 'react-editor-js';
import { EDITOR_JS_TOOLS } from "./tools";
import Editor from '@stfy/react-editor.js'


class myEditor extends Component {
    render() {
        return (
            // <EditorJs tools={EDITOR_JS_TOOLS}
            // />
            <Editor
                tools={EDITOR_JS_TOOLS}
                autofocus
                holderId="editorjs-container"
                excludeDefaultTools={['header']}
                placeholder="Add content here..."
                onChange={(data) => console.log(data)}

                onReady={() => console.log('Start!')}
                data={{
                    "time": 1554920381017,
                    "blocks": [
                        {
                            "type": "header",
                            "data": {
                                "text": "Hello Editor.js",
                                "level": 2
                            }
                        },
                    ],
                    "version": "2.12.4"
                }}
            />
        )
    }
}


export default myEditor;
// const editor = new EditorJS('editorjs');