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
                    "This is a test one line paragraph"
            }
        },
        {
            type: "paragraph",
            data: {
                text:
                    "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
            }
        },
        {
            type: "paragraph",
            data: {
                text:
                    "This is a test one line paragraph 2"
            }
        },

        {
            "type": "list",
            "data": {
                "style": "unordered",
                "items": [
                    "It is a block-styled editor",
                    "It returns clean data output in JSON",
                    "Designed to be extendable and pluggable with a simple API"
                ]
            }
        },

        {
            "type": "header",
            "data": {
                "text": "Header 1 level 2",
                "level": 2
            }
        },
        {
            type: "paragraph",
            data: {
                text:
                    "This is a test sentence number one.It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
            }
        },
        {
            "type": "list",
            "data": {
                "style": "ordered",
                "items": [
                    "It is a block-styled editor",
                    "It returns clean data output in JSON",
                    "Designed to be extendable and pluggable with a simple API"
                ]
            }
        },
        {
            "type": "header",
            "data": {
                "text": "Header 2 level 1",
                "level": 1
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
            type: "header",
            "data": {
                "text": "Header 3 level 5",
                "level": 5
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
        return (
            <Button onClick={this.jsPdfGenerator}  > Generate PDF </Button>
        )
    }

}