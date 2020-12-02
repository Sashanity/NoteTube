import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { deleteNoteDB } from '../../actions/documents';
import { UploadPopup } from '../popups/UploadPopup';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SelectedListItem(props) {
  const { noteID, setNotes, public_status } = props;
  console.log('noteID list of items:', noteID);

  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const [open, setOpen] = React.useState(false);

  const deleteNote = () => (open ? setOpen(false) : setOpen(true));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteDB = async (noteID, setNotes, public_status) => {
    console.log('handling delete, passing noteId:', noteID);
    await deleteNoteDB(noteID, public_status);
    setNotes();
    handleClose();
  };

  return (
    <div className={classes.root}>
      <List component='nav' aria-label='main mailbox folders'>
        <ListItem
          button
          // selected={selectedIndex === 0}
          onClick={(event) => handleListItemClick(event, 0)}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary='Edit' />
        </ListItem>
        <ListItem
          onClick={deleteNote}
          button
          // selected={selectedIndex === 1}
        >
          {/* Dialogbox */}
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>
              {'Delete Class Note? '}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                Do you want to Delete Class Notes?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color='primary'>
                No
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteDB(noteID, setNotes, public_status);
                  handleClose();
                }}
                color='primary'
                autoFocus
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
          <ListItemIcon>
            <DeleteIcon></DeleteIcon>
          </ListItemIcon>

          <ListItemText primary='Delete' />
        </ListItem>
      </List>
      <Divider />
    </div>
  );
}
