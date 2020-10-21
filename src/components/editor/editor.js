import EditorJs from 'react-editor-js';
import { EDITOR_JS_TOOLS } from "./tools";
import React from 'react';
import { save } from '../../actions/editorSave'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Sidebar from "../Layout/Sidebar";
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

function myEditor() {
    let editorButtons = ['Upload', 'New Note', 'Download']
    let data
    const setData = (e) =>{
        data = e
        console.log(data)
    }
    const openEditor = (e) => {
        e.preventDefault();
        window.open("/editor", "_blank")
      }
      
    const downloadData = (e) => {

        e.preventDefault();
        save(data)
      }
      
    return (
        <div style={{ display: 'flex' }} >
            <Grid container spacing={2} direction='column'>
                <Grid item xs={12} container>
                    <Grid item xs={2} />
                    <Grid item xs={1}>
                        <Button 
                         variant="contained"
                         style={{ width: '130px', margin: 1}}
                         color={"primary"}
                         startIcon={ <AddIcon />}
                         onClick={openEditor}>
                         {"New Note"}
                        </Button>
                        <Button
                        variant="contained"
                        style={{ width: '130px', margin: 1}}
                        color={"primary"}
                        startIcon={<CloudDownloadIcon />}
                        onClick={downloadData}>
                            {"Download"}
                        </Button>
                    </Grid>
                    <Grid item xs={5}>
                        <Paper elevation={20} style={{ width: '700px' }}>
                            <EditorJs
                                tools={EDITOR_JS_TOOLS}
                                autofocus
                                placeholder="Add content here..."
                                onChange={(e) => setData(e)}
                                onReady={() => console.log('Start typing!')}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}
export default myEditor;
