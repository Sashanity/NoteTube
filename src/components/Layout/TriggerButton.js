import React from 'react';

import './modal.css';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

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
      color="default"
      className={classes.button}
      startIcon={<CloudUploadIcon />}
      ref={buttonRef}
      onClick={showModal}
    >
      Upload
    </Button>
  );
};
export default Trigger;
