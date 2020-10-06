import React, { PureComponent } from 'react';
import { Button, } from '@material-ui/core';

import jsPDF from 'jspdf'
let data = {
    "time": 1554920381017,
    "blocks": [

        {
            type: "paragraph",
            data: {
                text:
                    "This is a test sentence number one"
            }
        },
        {
            type: "paragraph",
            data: {
                text:
                    "This is a test sentence number two"
            }
        },

        {
            type: "paragraph",
            data: {
                text:
                    "This is a test sentence number three"
            }
        },
        {
            type: "paragraph",
            data: {
                text:
                    "This is a test sentence number four"
            }
        },
        {
            type: "paragraph",
            data: {
                text:
                    "This is a test sentence number five"
            }
        }


    ],
    "version": "2.12.4"
}

export default class pdfGenerate extends PureComponent {

    // JSpdf Generator For generating the PDF
    jsPdfGenerator = () => {
        let numOfLines = 0;

        let next, tmp, cur = 10;
        next = cur;

        var doc = new jsPDF('p', 'mm', [297, 210]); // creates A4 format page
        // 
        doc.setFont('Roboto-Regular');
        // doc.setTextColor(255, 0, 0)

        data.blocks.forEach((block, i) => {
            numOfLines = 0;

            doc.setFontSize(10)
            var splitText = doc.splitTextToSize(block.data.text, 180);
            console.log('split text length', splitText.length)
            numOfLines = splitText.length

            // write on next availible pos
            console.log('now printing at post Y:', cur)
            doc.text(10, cur, splitText)
            // recalculate next 


            next = next + (5 * numOfLines)
            console.log('next block will be at Y:', next)
            // recalculate previous

            cur = next;
            console.log('previous pos Y:', cur)

        })
        doc.save('editor.pdf');
    }

    render() {
        return (
            <Button onClick={this.jsPdfGenerator}  > Generate PDF </Button>
        )
    }

}