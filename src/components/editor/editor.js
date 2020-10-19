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
            type: "paragraph",
            data: {
                text:
                    "This is a test one line paragraph"
            }
        }]
}
class myEditor extends Component {

    jsPdfGenerator = () => {

        let numOfLines = 0;

        let next, cur = 10;
        next = cur;

        var doc = new jsPDF('p', 'mm', [297, 210]); // creates A4 format page

        doc.setFont('Roboto-Regular');
        // doc.setTextColor(255, 0, 0)

        data.blocks.forEach((block, i) => {
            // block.type === 'header' ? doc.setFontSize(20) : doc.setFontSize(10)

            if (block.type === 'header') {
                switch (block.data.level) {
                    case 1:
                        doc.setFontSize(22)
                        break;
                    case 2:
                        doc.setFontSize(20)
                        break;
                    case 3:
                        doc.setFontSize(18)
                        break;
                    case 4:
                        doc.setFontSize(16)
                        break;
                    case 5:
                        doc.setFontSize(14)
                        break;
                    case 6:
                        doc.setFontSize(12)
                        break;
                    default:
                        doc.setFontSize(10)

                }

            }
            else {
                doc.setFontSize(10)
            }

            numOfLines = 0;

            if (block.type === 'list') {
                let bulletPoint = '* ';

                block.data.items.forEach((item, i) => {
                    block.data.style === 'unordered' ? bulletPoint = '* ' : bulletPoint = i + 1 + '. '

                    var splitText = doc.splitTextToSize(item, 180);
                    console.log('list item #', i)
                    numOfLines = splitText.length

                    console.log('list now printing at post Y:', cur)
                    doc.text(10, cur, bulletPoint + splitText)
                    next = next + (5 * numOfLines)
                    console.log('list next block will be at Y:', next)
                    cur = next;
                    console.log(' list previous pos Y:', cur)
                })
            }
            else {
                var splitText = doc.splitTextToSize(block.data.text, 180);
                console.log('split text length', splitText.length)
                numOfLines = splitText.length

                console.log('now printing at post Y:', cur)
                doc.text(10, cur, splitText)

                next = next + (5 * numOfLines)
                console.log('next block will be at Y:', next)

                cur = next;
                console.log('previous pos Y:', cur)
            }
        })

        doc.save('editor.pdf');
    }

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
                            onChange={(data) => { this.data = data }}
                            onReady={() => console.log('Start typing!')}
                        />
                    </Paper >
                    <button onClick={this.jsPdfGenerator}>save</button>
                </div>


            </div>

        )
    }
}
export default myEditor;
