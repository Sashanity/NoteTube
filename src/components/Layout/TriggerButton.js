import React from 'react';
import './modal.css';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { save } from '../../actions/editorSave'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

let openEditor = (e) => {
  e.preventDefault();
  window.open("/editor", "_blank")
}

let downloadData = (e) => {
  e.preventDefault();
  save()
}


const Trigger = ({ triggerText, buttonRef, showModal }) => {
  const classes = useStyles();
  return (
    <Button
      variant="contained"
      style={{ width: '130px' }}
      color={triggerText === 'Upload' ? "default" : "primary"}
      className={classes.button}
      startIcon={triggerText === 'Upload' ? <CloudUploadIcon /> : triggerText === 'New Note' ? <AddIcon /> : triggerText === 'Download' ? <CloudDownloadIcon /> : ''}
      ref={buttonRef}
      onClick={triggerText === 'Upload' ? showModal : triggerText === 'New Note' ? openEditor : triggerText === 'Download' ? downloadData : ""}
    >
      {triggerText}
    </Button>
  );
};
export default Trigger;
