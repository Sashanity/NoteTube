import React, { useState } from 'react';
import Dropzone, { useDropzone } from 'react-dropzone';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { upload } from '../../actions/documents';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  dropzone: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    marginLeft: 150,
  },
}));
const UploadPopup = (props) => {
  const [state, setState] = useState({
    checked: true,
    name: '',
    course: '',
    instructor: '',
    term: '',
    subject: '',
    file: null,
  });
  const { checked, name, course, instructor, term, subject, file } = state;

  const { title, description, open, handleClose } = props;
  const classes = useStyles();

  const subjects = [
    'Arts',
    'Accounting',
    'Biology',
    'Business',
    'Chemistry',
    'Criminal Justice',
    'Computer Science',
    'Computer Engineering',
    'Dance',
    'Engineering',
    'History',
    'Kinesiology',
    'Music',
    'Mathematics',
    'Marketing',
    'Physics',
    'Physcology',
    'Social Science',
    'Other',
  ];
  const [fileState, setFileState] = useState([]);

  const handleFileChange = (files) => {
    setFileState([...fileState, files]);
    console.log(files)
  };
  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
     //console.log(file);
     setState({ ...state, file: file });
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const onChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });
  const onChange2 = (e) => setState({ ...state, ['checked']: !checked });
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(state);
    await upload(checked, name, course, instructor, term, subject, file);
    handleClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>{title}</DialogTitle>
      <form className={classes.form} onSubmit={(e) => onSubmit(e)}>
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            value={name}
            name='name'
            onChange={(e) => onChange(e)}
            label='Name'
            fullWidth
          />
          <TextField
            autoFocus
            margin='dense'
            id='name'
            value={course}
            name='course'
            onChange={(e) => onChange(e)}
            label='Course'
            fullWidth
          />
          <TextField
            autoFocus
            margin='dense'
            id='name'
            value={instructor}
            name='instructor'
            onChange={(e) => onChange(e)}
            label='Instructor Name'
            fullWidth
          />
          <TextField
            autoFocus
            margin='dense'
            id='name'
            value={term}
            name='term'
            onChange={(e) => onChange(e)}
            label='Term (semester)'
            fullWidth
          />
          <FormControl style={{ width: 550 }}>
            <InputLabel id='demo-simple-select-label'>Subject</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={subject}
              inputProps={{
                name: 'subject',
                id: 'subject-native-simple',
              }}
              onChange={(e) => onChange(e)}
            >
              {subjects.map((subject) => (
                <MenuItem value={subject}>{subject}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={(e) => onChange2(e)}
                name='checked'
                color='primary'
              />
            }
            label='Do you want this note to be public?'
            labelPlacement='start'
          />
          <Button className={classes.dropzone}>
            <Dropzone>
              {() => (
                <section className='dropzone_container'>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    Click here to Upload Files
                  </div>
                </section>
              )}
            </Dropzone>
          </Button>
        </DialogContent>
        <DialogActions>
          <Button type='submit' color='primary' variant='contained'>
            Confirm
          </Button>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UploadPopup;
