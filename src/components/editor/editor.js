import React from 'react';
import EditorJs from '@natterstefan/react-editor-js'
import { EDITOR_JS_TOOLS } from "./tools";
import AddIcon from '@material-ui/icons/Add';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { styles } from './pdfStyles'
var htmlToPdfmake = require("html-to-pdfmake");

const MyEditor = () => {
    let editor = null
    const onSave = async () => {
        // https://editorjs.io/saving-data
        try {
            const outputData = await editor.save()
            console.log('Article data: ', outputData)
            downloadPDF(outputData)

        } catch (e) {
            console.log('Saving failed: ', e)
        }
    }
    let data
    const openEditor = (e) => {
        e.preventDefault();
        window.open("/editor", "_blank")
    }
    return (
        <div style={{ display: 'flex' }} >
            <Grid container spacing={2} direction='column'>
                <Grid item xs={10} container>
                    <Grid item xs={2} />
                    <Grid item xs={2} >
                        <Button
                            variant="contained"
                            style={{ width: '130px' }}
                            color={"primary"}
                            startIcon={<AddIcon />}
                            onClick={openEditor}>
                            {"New Note"}
                        </Button>
                        <br />
                        <br />
                        <Button
                            variant="contained"
                            style={{ width: '130px' }}
                            color={"primary"}
                            startIcon={<CloudDownloadIcon />}
                            onClick={onSave}
                        >
                            {"Download"}
                        </Button>
                    </Grid>
                    <Grid item xs={5}>
                        <Paper elevation={20} style={{ width: '794px' }}>
                            <EditorJs
                                data={data}
                                tools={EDITOR_JS_TOOLS}
                                autofocus
                                placeholder="Add content here..."
                                // will be `editorjs` by default
                                holder="custom-editor-container"
                                editorInstance={editorInstance => {
                                    // invoked once the editorInstance is ready
                                    editor = editorInstance
                                }}
                            >
                                <div id="custom-editor-container" />
                            </EditorJs>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}
export default MyEditor;

/**
 * pdfmake instance, creates and downloads a pdf file constructed from editor text data
 * 
 * @param {Object} data 
 */
const downloadPDF = (data) => {
    let pdfMake = require('pdfmake/build/pdfmake.js');
    // var pdfFonts = {
    //     Roboto: {
    //         normal: 'fonts/Roboto/Roboto-Regular.ttf',
    //         bold: 'fonts/Roboto/Roboto-Medium.ttf',
    //         italics: 'fonts/Roboto/Roboto-Italic.ttf',
    //         bolditalics: 'fonts/Roboto/Roboto-MediumItalic.ttf'
    //     }
    // };
    let pdfFonts = require('pdfmake/build/vfs_fonts.js');
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    let content = processData(data)
    let docDefinition = {
        content: content,
        styles: styles
    };
    let fileName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    pdfMake.createPdf(docDefinition).download(fileName);
}

/**
 * Helper funciton to process JSON object,
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
                content[i] = { text: block.data.text.replace(/<\/?[^>]+>/gi, '').replace("&nbsp;", " "), style: style }
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
                // content[i] = { image: block.data.url, width: 500 }
                content[i] = { image: block.data.url, width: 350 }
                content[++i] = { text: block.data.caption + '\n\n' }
                break;
            case 'table':
                console.log(block.data.content)
                content[i] = {
                    table: {
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



