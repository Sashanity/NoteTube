import React from 'react';
import EditorJs from '@natterstefan/react-editor-js'
import { EDITOR_JS_TOOLS } from "./tools";
import AddIcon from '@material-ui/icons/Add';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { downloadPDF } from "./createPDF.js"
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

    button: {
        padding: 8,
        width: 100,
    },
}));

const MyEditor = () => {
    let editor = null
    const classes = useStyles();
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
                            className={classes.button}
                            color={"primary"}
                            onClick={openEditor}>
                            <AddIcon />
                        </Button>
                        <br />
                        <br />
                        <Button
                            variant="contained"
                            style={{ width: '100px', padding: '8px' }}
                            color={"primary"}
                            // startIcon={}
                            onClick={onSave}
                        >
                            <CloudDownloadIcon />
                        </Button>

                    </Grid>
                    <Grid item xs={5}>
                        <Paper elevation={20} style={{ width: '794px', 'padding-top': '20px' }}>
                            <EditorJs
                                style={{ 'margin-top': '50px' }}
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
