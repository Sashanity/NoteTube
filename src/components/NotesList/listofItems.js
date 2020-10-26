import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AlertDeleteBox from "./AlertDeleteBox";
import { DialogContent } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SelectedListItem() {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };


      // AlertBox 

    // const [alert,SetAlert]= useState(false);
    
    // const alertBox =()=>(alert ? SetAlert(false) : SetAlert(true));



  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItem
          button
          // selected={selectedIndex === 0}
          onClick={(event) => handleListItemClick(event, 0)}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </ListItem>
        <ListItem
          button
          // selected={selectedIndex === 1}
         >
        

        {/* <div onClick={alertBox}> */}
           <ListItemIcon >
          
          <DeleteIcon></DeleteIcon>
          {/* {alert ? <AlertDeleteBox></AlertDeleteBox>:null} */}
         
          </ListItemIcon>
          {/* </div> */}
          <ListItemText primary="Delete"/>   
            
        </ListItem>
      </List>
      <Divider />

    </div>
  );
}