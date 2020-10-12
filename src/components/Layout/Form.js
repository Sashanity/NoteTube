import React from 'react';
import './modal.css';
import { useDropzone } from "react-dropzone"

import { green, grey } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  customWidth: {
    maxWidth: 500,
  },
  noMaxWidth: {
    maxWidth: 'none',
  }

}));

const uploadButtonHint = `Upload note to the database`;
const nameFieldHint = `How would you like to name your note? exp: Lecture 1`;
const courseFieldHint = `What is the class name the notes are for? exp: CMPE 188`;
const instrFieldHint = `What was the name of instructor of the class? exp: John Doe `;
const termFieldHint = `When did you take the class? exp: Fall 2018`;
const inputFieldHint = `Choose what files to attach (pdf)`
export const Form = ({ onSubmit }) => {
  const classes = useStyles();
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone()

  //switched state
  const PurpleSwitch = withStyles({
    switchBase: {
      color: grey[300],
      '&$checked': {
        color: green[500],
      },
      '&$checked + $track': {
        backgroundColor: green[500],
      },
    },
    checked: {},
    track: {},
  })(Switch);

  const [state, setState] = React.useState({
    checkedA: true,
  });
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ))
  return (
    <div className="form_section" >
      <form className="form" onSubmit={onSubmit}>
        <div className="form_section">
          <Tooltip arrow placement="right" title={nameFieldHint} classes={{ tooltip: classes.customWidth }} TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
            <label htmlFor="name"> Name </label>
          </Tooltip>

          <input className="form-input" id="name" />

        </div>

        <div className="form_section">
          <Tooltip arrow placement="right" title={courseFieldHint} classes={{ tooltip: classes.customWidth }} TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
            <label htmlFor="name">Course </label>
          </Tooltip>

          <input className="form-input" id="name" />
        </div>

        <div className="form_section">
          <Tooltip arrow placement="right" title={instrFieldHint} classes={{ tooltip: classes.customWidth }} TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
            <label htmlFor="name">Instructor Name</label>
          </Tooltip>
          <input className="form-input" id="name" />
        </div>

        <div className="form_section">
          <Tooltip arrow placement="right" title={termFieldHint} classes={{ tooltip: classes.customWidth }} TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
            <label htmlFor="name">Term (semester)</label>
          </Tooltip>
          <input className="form-input" id="name" />
        </div>

        <section className="dropzone_container">
          <Tooltip arrow placement="right" title={inputFieldHint} classes={{ tooltip: classes.customWidth }} TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              <p>Click here to Upload Files</p>
            </div>
          </Tooltip>
        </section>

        {/* switched for Publish notes  */}

        <FormGroup>
          <FormControlLabel
            control={<PurpleSwitch checked={state.checkedA} onChange={handleChange} name="checkedA" />}
            label="Publish Notes"
          />
        </FormGroup>

        <div className="form-group">
          <Tooltip arrow title={uploadButtonHint} classes={{ tooltip: classes.customWidth }} TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              startIcon={<CloudUploadIcon />}
            >
              Upload
      </Button>
          </Tooltip>

        </div>
      </form>
    </div >
  );
};
export default Form;
