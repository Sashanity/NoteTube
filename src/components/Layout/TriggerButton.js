import React from 'react';
import './modal.css';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';


import jsPDF from 'jspdf'
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

let data = {
  "time": 1554920381017,
  "blocks": [
    {
      "type": "header",
      "data": {
        "text": "Hello Editor.js",
        "level": 2
      }
    },
    {
      type: "paragraph",
      data: {
        text:
          "We have been working on this project more than three years. Several large media projects help us to test and debug the Editor, to make it's core more stable. At the same time we significantly improved the API. Now, it can be used to create any plugin for any task. Hope you enjoy."
      }
    },
  ],
  "version": "2.12.4"
}
let jsPdfGenerator = () => {
  var doc = new jsPDF('p', 'mm', [297, 210]); // creates A4 format page
  doc.setFont('Roboto-Regular');
  doc.setTextColor(255, 0, 0)

  data.blocks.forEach((block, i) => {
    block.type === "header" ? doc.setFontSize(30) : doc.setFontSize(10)
    var splitText = doc.splitTextToSize(block.data.text, 180);
    doc.text(10, 10 + (i * 10), splitText)
  })
  doc.save('editor.pdf');
}

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
