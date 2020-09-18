import React from 'react';

import './modal.css';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const Trigger = ({ triggerText, buttonRef, showModal }) => {
  const classes = useStyles();
  return (
    <Button
      variant="contained"
      style={{ width: '130px' }}
      color={triggerText === 'Upload' ? "default" : "primary"}
      className={classes.button}
      startIcon={triggerText === 'Upload' ? <CloudUploadIcon /> : triggerText === 'New Note' ? <AddIcon /> : ''}
      ref={buttonRef}
      onClick={triggerText === 'Upload' ? showModal : ""}
    >
      {triggerText}
    </Button>

  );
};
export default Trigger;
