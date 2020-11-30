import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import UploadPopup from './../popups/UploadPopup';
import ScrollableTabsButtonForce from '../personalSpace/tabpanel';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  button: {
    padding: 8,
    width: 100,
  },
}));

const PersonalSpace = () => {
  const history = useHistory();
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={2} />
        <Grid item xs={1}>
          <Button
            aria-label='Upload'
            className={classes.button}
            color='default'
            variant='contained'
            onClick={(e) => {
              e.preventDefault();
              setTitle('Uploading Note');
              setDescription('Please fill out the form below.');
              handleClickOpen();
            }}
          >
            <CloudUploadIcon />
          </Button>
          {/* <br />
          <br /> */}
          <Button
            aria-label='Edit'
            color='primary'
            className={classes.button}
            variant='contained'
            onClick={(e) => {
              e.preventDefault();
              window.open("/editor", "_blank")
            }}
          >
            <AddIcon />
          </Button>
        </Grid>
        <Grid item xs={7}>
          <ScrollableTabsButtonForce></ScrollableTabsButtonForce>
        </Grid>
        <UploadPopup
          title={title}
          open={open}
          description={description}
          handleClose={handleClose}
        ></UploadPopup>
      </Grid>
    </div>
  );
};
export default PersonalSpace;
