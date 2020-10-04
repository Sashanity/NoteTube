
// import React from 'react'
// import { Component } from 'react';
// // import EditorJs from 'react-editor-js';
// import { EDITOR_JS_TOOLS } from "./tools";
// import Editor from '@stfy/react-editor.js'


// class myEditor extends Component {
//     render() {
//         return (
//             // <EditorJs tools={EDITOR_JS_TOOLS}
//             // />
//             <Editor
//                 tools={EDITOR_JS_TOOLS}
//                 autofocus
//                 holderId="editorjs-container"
//                 excludeDefaultTools={['header']}
//                 placeholder="Add content here..."
//                 onChange={(data) => console.log(data)}

//                 onReady={() => console.log('Start!')}
//                 data={{
//                     "time": 1554920381017,
//                     "blocks": [
//                         {
//                             "type": "header",
//                             "data": {
//                                 "text": "Hello Editor.js",
//                                 "level": 2
//                             }
//                         },
//                     ],
//                     "version": "2.12.4"
//                 }}
//             />
//         )
//     }
// }


// export default myEditor;
// // const editor = new EditorJS('editorjs');
import React, { Component } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';

const editor = new EditorJS({
    /** 
     * Id of Element that should contain the Editor 
     */
    holder: 'editorjs',

    /** 
     * Available Tools list. 
     * Pass Tool's class or Settings object for each Tool you want to use 
     */
    tools: {
        header: {
            class: Header,
            inlineToolbar: ['link']
        },
        list: {
            class: List,
            inlineToolbar: true
        }
    },
})

class Editor extends Component {

    render() {
        return (
            <div>
                {editor}
            </div>
        );
    }
}

export default Editor;