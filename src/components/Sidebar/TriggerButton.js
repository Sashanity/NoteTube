import React from 'react';
<<<<<<< HEAD:src/components/Sidebar/TriggerButton.js

import "../Upload form/modal.css";
=======
import './modal.css';

>>>>>>> master:src/components/Layout/TriggerButton.js
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

let openEditor = (e) => {
  e.preventDefault();
  window.open("/editor", "_blank")
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
      onClick={triggerText === 'Upload' ? showModal : triggerText === 'New Note' ? openEditor : ""}
    >
      {triggerText}
    </Button>
  );
};
export default Trigger;
