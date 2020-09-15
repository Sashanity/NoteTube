import React from 'react';
import './modal.css';
import {useDropzone} from "react-dropzone"
import { green, grey, purple } from '@material-ui/core/colors';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

export const Form = ({ onSubmit }) => {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone()
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
    <div className="form_section">
    <form className="form" onSubmit={onSubmit}>
      <div className="form_section">
        <label htmlFor="name">Course </label>
        <input className="form-input" id="name" />
      </div>
      <div className="form_section">
        <label htmlFor="name"> File Name </label>
        <input className="form-input" id="name" />
      </div>
      <div className="form_section">
        <label htmlFor="name">Instructor Name</label>
        <input className="form-input" id="name" />
      </div>

      <div className="form_section">
        <label htmlFor="name">Term( Spring/ Fall)</label>
        <input className="form-input" id="name" />
      </div>
      

      <section className="dropzone_container">
      <div {...getRootProps({className: "dropzone"})}>
        <input {...getInputProps()} />
        <p>Click here to Upload Notes</p>
      </div>
    </section>
   
{/* switched for Publish notes  */}

<FormGroup>
      <FormControlLabel
        control={<PurpleSwitch checked={state.checkedA} onChange={handleChange} name="checkedA" />}
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
