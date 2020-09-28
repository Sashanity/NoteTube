import React, { PureComponent } from 'react';
import { Button, } from '@material-ui/core';

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

export default class pdfGenerate extends PureComponent {

    // JSpdf Generator For generating the PDF
    jsPdfGenerator = () => {

        var doc = new jsPDF('p', 'mm', [297, 210]); // creates A4 format page

        doc.setFont('Roboto-Regular');
        doc.setTextColor(255, 0, 0)
        // doc.setCharSpace(0.3)
        // doc.setFontStyle("italic")
        // doc.autoPrint()
        // doc.setFontSize(30)
        // doc.setFont('bold');
        data.blocks.forEach((block, i) => {
            block.type === "header" ? doc.setFontSize(30) : doc.setFontSize(10)
            var splitText = doc.splitTextToSize(block.data.text, 180);
            doc.text(10, 10 + (i * 10), splitText)
        })
        doc.save('editor.pdf');
    }

    render() {
        return (
            <Button onClick={this.jsPdfGenerator} > Generate PDF </Button>
        )
    }

}