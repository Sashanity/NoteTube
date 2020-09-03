import React from 'react';
import './modal.css';
import {useDropzone} from "react-dropzone"
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

export const Form = ({ onSubmit }) => {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone()

  // Toggle Switch CSS
  const IOSSwitch = withStyles((theme) => ({
    root: {
      width: 42,
      height: 26,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 1,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#52d869',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#52d869',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 24,
      height: 24,
    },
    track: {
      borderRadius: 26 / 2,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  }))(({ classes, ...props }) => {
    return (
      <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
        {...props}
      />
    );
  });


//Toggle Switched
  const [state, setState] = React.useState({

    checkedB: true,

  });
// Upload dropZone 
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ))

  return (
    <div className="form_section">
    <form className="form" onSubmit={onSubmit}>
      <div className="form_section">
        <label htmlFor="name">Course Name</label>
        <input className="form-input" id="name" />
      </div>
      <div className="form_section">
        <label htmlFor="name">Semester </label>
        <input className="form-input" id="name" />
      </div>
      <div className="form_section">
        <label htmlFor="name">Instructor Name</label>
        <input className="form-input" id="name" />
      </div>
      <div className="form_section">
        <label htmlFor="name">File Name</label>
        <input className="form-input" id="name" />
      </div>
      <div className="form_section">
        <label htmlFor="name">Course Name</label>
        <input className="form-input" id="name" />
      </div>

      <section className="dropzone_container">
      <div {...getRootProps({className: "dropzone"})}>
        <input {...getInputProps()} />
        <p>Click here to Upload Notes</p>
      </div>
    </section>
    {/* Add toggle switch here */}
     <FormGroup>
    <FormControlLabel
        control={<IOSSwitch checked={state.checkedB} onChange={handleChange} name="checkedB" />}
        label="Publish Notes"
      />
    </FormGroup>

      <div className="form-group">
        <button className="form-control btn btn-primary" type="submit">
          Submit
        </button>
      </div>
    </form>
    </div>
  );
};
export default Form;
