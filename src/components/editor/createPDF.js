import { styles } from './pdfStyles';
var htmlToPdfmake = require("html-to-pdfmake");

/**
 * pdfmake instance, creates and downloads a pdf file constructed from editor text data
 * 
 * @param {Object} data 
 */
export const downloadPDF = (data) => {
    let pdfMake = require('pdfmake/build/pdfmake.js');

    let pdfFonts = require('pdfmake/build/vfs_fonts.js');
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    let content = processData(data)
    let docDefinition = {
        content: content,
        styles: styles
    };
    let fileName = 'NoteTube_note_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    pdfMake.createPdf(docDefinition).download(fileName);
}

/**
 * Helper function to process JSON object,
 * converts incoming data in array of String objects
 * strips html tags
 * @param {Object} data text data from editor
 * 
 * @returns {array} content  array of Strings/nested array of strings
 */
function processData(data) {
    console.log("in process function")
    console.log(data.blocks)
    let content = []
    let i = 0
    let style
    data.blocks.forEach((block) => {
        console.log('working on block: ', i, block.type)
        switch (block.type) {
            case 'header':

                switch (block.data.level) {
                    case 1:
                        style = 'header1';
                        break;
                    case 2:
                        style = 'header2';
                        break;
                    case 3:
                        style = 'header3';
                        break;
                    case 4:
                        style = 'header4';
                        break;
                    case 5:
                        style = 'header5';
                        break;
                    case 6:
                        style = 'header6';
                        break;
                    default:
                        style = 'header1'
                }
                content[i] = { text: block.data.text.replace(/<\/?[^>]+>/gi, '').replace("&nbsp;", " ") + '\n\n', style: style }
                break;
            case 'paragraph':
                // content[i] = block.data.text.replace(/<\/?[^>]+>/gi, '').replace("&nbsp;", " ") + '\n\n'
                // content[i] = checkHTMLstyles(block.data.text)
                content[i] = { text: htmlToPdfmake(block.data.text) }
                content[++i] = { text: '\n' }
                break;
            case 'list':
                let itemsClean = [];
                block.data.items.forEach((item, j) => {
                    itemsClean[j] = item.replace(/<\/?[^>]+>/gi, '').replace("&nbsp;", " ");
                })
                block.data.style === 'unordered' ? content[i] = { ul: itemsClean } : content[i] = { ol: itemsClean }
                break;
            case 'image':
                content[i] = { image: block.data.url, width: 350 }
                content[++i] = { text: block.data.caption + '\n\n' }
                break;
            case 'table':
                console.log(block.data.content)
                let len = block.data.content[0].length
                let widths = new Array(len)
                widths.fill('*')
                content[i] = {
                    // layout: 'lightHorizontalLines', // optional
                    table: {
                        headerRows: 1,
                        widths: widths,
                        body: block.data.content
                    }
                }
                break;
            case 'delimiter':
                style = 'delimiter'
                content[i] = { text: '* * *', style: style }
                break;
            case 'code':
                style = 'code'
                content[i] = { text: block.data.code, style: style }
                break;
            default:
                content[i] = block.data.text.replace(/<\/?[^>]+>/gi, '').replace("&nbsp;", " ")
        }
        i++
    })
    return content
}



