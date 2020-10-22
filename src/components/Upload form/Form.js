import React, { useCallback} from 'react';
import './modal.css';
import Dropzone, { useDropzone } from "react-dropzone"
import axios from 'axios'
import { upload } from '../../actions/documents'
import { green, grey } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import createSvgIcon from '@material-ui/icons/utils/createSvgIcon';


const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

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

export const Form = () => {
  const classes = useStyles();

  const [state, setState] = React.useState({
    checkedA: true,
    name: '',
    course: '',
    instructor: '',
    term: '',
    subject: ''
  });

  const [fileState, setFileState] = React.useState([]);


  const handleRadioChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };


  const handleFileChange = (files) => {
    setFileState([...fileState, files])
    //console.log(files)
  };

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents
        const binaryStr = reader.result
        console.log(binaryStr)
        handleFileChange(binaryStr)
      }
      reader.readAsArrayBuffer(file)
    })
    
  }

  const {getRootProps, getInputProps} = useDropzone({onDrop})

  const onChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });

  const { checkedA, name, course, instructor,  term,   subject } = state;


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(state, fileState)
    upload(checkedA,  name, course, instructor,  term,   subject, fileState)
  }
  const subjects = [
    { title: 'Arts'},
    { title: 'Accounting'},
    { title: 'Biology'},
    { title: "Business"},
    { title: "Chemistry"},
    { title: "Criminal Justice"},
    { title: 'Computer Science'},
    { title: 'Computer Engineering'},
    { title: "Dance"},
    { title: "Engineering"},
    { title: 'History'},
    { title: "Kinesiology" },
    { title: "Music"},
    { title: 'Mathematics'},
    { title: 'Marketing'},
    { title: 'Physics'},
    { title: "Physcology"},
    { title: "Social Science" },
    { title: "Other"},
  ];
  return (

    
    <div className="form_section" >
      <form className="form" onSubmit={handleSubmit}>
        <div className="form_section">
          <label htmlFor="name"> Name </label>
          <input onChange={onChange} className="form-input" name="name" />
        </div>
        <div className="form_section">
          <label htmlFor="course">Course </label>
          <input  onChange={onChange}  className="form-input" name="course" />
        </div>
        <div className="form_section">
          <label htmlFor="instructor">Instructor Name</label>
          <input  onChange={onChange}  className="form-input" name="instructor" />
        </div>

        <div className="form_section">
          <label htmlFor="semester">Term (semester)</label>
          <input  onChange={onChange}  className="form-input" name="term" />
        </div>

        <Autocomplete className="dropdown"
      id="combo-box-demo"
      options={subjects}
      getOptionLabel={(option) => option.title}
      style={{ width: 200, color:"white"}}
      renderInput={(params) => <TextField {...params} label="Subject" variant="outlined" />}
    />

        <Dropzone className="dropzone">
        {() => ( <section className="dropzone_container">
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Click here to Upload Files</p>
          </div>
        </section>) }
        </Dropzone>

        {/* switched for Publish notes  */}

        <FormGroup>
          <FormControlLabel
            control={<PurpleSwitch checked={state.checkedA} onChange={handleRadioChange} name="checkedA" />}
            label="Publish Notes"
          />
        </FormGroup>

        <div className="form-group">
          {/* <button className="form-control btn btn-primary" type="submit">
          Submit
        </button> */}
          <Button
            type="submit"
            variant="contained"
            color="default"
            className={classes.button}
            startIcon={<CloudUploadIcon />}
          >
            Upload
        </Button>

        </div>
      </form>
    </div>
  );




};
export default Form;
