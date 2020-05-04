import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import FormHelperText from '@material-ui/core/FormHelperText';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(10)
  },
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: theme.spacing(75)
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', 
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Register = () => {
    const [formState, setForm] = useState({
      firstName: "",
      firstNameError: "",
      lastName: "",
      lastNameError: "",
      email: "",
      emailError: "",
      userName: "",
      userNameError: "",
      firstPassword: "",
      firstPasswordError: "",
      lastPassword: "",
      lastPasswordError: ""
    })
    const { firstName, firstNameError, lastName, lastNameError,
       email, emailError, userName, userNameError, firstPassword, firstPasswordError, lastPassword, lastPasswordError } = formState
    const classes = useStyles();

    const onChange = e => setForm({...formState, [e.target.name]: e.target.value})
    
    const validation = () => {
      let valid = true;
      const errors = {
        emailError: "",
        lastPasswordError: ""
      };
      if(firstPassword !== lastPassword){
        valid = false
        errors.lastPasswordError = "Passwords do not match"
      }
      const emailValid = email.split("").reverse().join(""); 
      if (emailValid.substring(0,9) !== "ude.usjs@"){
        valid = false
        errors.emailError = "Not a valid SJSU email address"
      }
      if (!valid){
        setForm({...formState, ...errors})
      }
      return valid
    }
    
    const onSubmit = e => {
      e.preventDefault();
      const valid = validation();
      if (valid){
        setForm({
          firstName: "",
          firstNameError: "",
          lastName: "",
          lastnameError: "",
          email: "",
          emailError: "",
          userName: "",
          userNameError: "",
          firstPassword: "",
          firstPasswordError: "",
          lastPassword: "",
          lastPasswordError: ""
        })
      }
    }
    return (
      <div className = {classes.root}>
        <Grid container spacing = {2} direction = "column">
          <Grid item  xs = {12} container>
            <Grid item xs = {4}/>
              <Paper>
                <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                  <Avatar className={classes.avatar}>
                      <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    Register
                  </Typography>
                  <form className={classes.form}  onSubmit={e => onSubmit(e)}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          autoComplete="fname"
                          name="firstName"
                          variant="outlined"
                          required
                          fullWidth
                          id="firstName"
                          label="First Name"
                          value= {firstName}
                          error = {firstNameError}
                          onChange={e => onChange(e)}
                          autoFocus
                        />
                        <FormHelperText color= "red">{firstNameError}</FormHelperText>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          variant="outlined"
                          required
                          fullWidth
                          id="lastName"
                          label="Last Name"
                          value = {lastName}
                          onChange={e => onChange(e)}
                          name="lastName"
                          error= {lastNameError}
                          autoComplete="lname"
                        />
                          <FormHelperText color= "red">{lastNameError}</FormHelperText>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          error = {emailError}
                          variant="outlined"
                          required
                          fullWidth
                          id="email"
                          value = {email}
                          onChange={e => onChange(e)}
                          label="SJSU Email Address"
                          name="email"
                          autoComplete="email"
                        />
                        <FormHelperText error>{emailError}</FormHelperText>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          variant="outlined"
                          error = {userNameError}
                          required
                          fullWidth
                          id="userName"
                          value = {userName}
                          onChange={e => onChange(e)}
                          label="Username"
                          name="userName"
                          autoComplete="username"
                        />                        
                        <FormHelperText color= "red">{userNameError}</FormHelperText>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          error = {firstPasswordError}
                          variant="outlined"
                          required
                          fullWidth
                          name="firstPassword"
                          label="Password"
                          onChange={e => onChange(e)}
                          value = {firstPassword}
                          type="password"
                          id="password"
                          autoComplete="current-password"
                        />                        
                        <FormHelperText color= "red">{firstPasswordError}</FormHelperText>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          error = {lastPasswordError}
                          variant="outlined"
                          required
                          fullWidth
                          name="lastPassword"
                          value = {lastPassword}
                          onChange={e => onChange(e)}
                          label="Re-enter Password"
                          type="password"
                          id="password"
                          autoComplete="current-password"
                        />
                        <FormHelperText error>{lastPasswordError}</FormHelperText>
                      </Grid>
                    </Grid>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                      <Grid item>
                        <Link to ="/login" variant="body2">
                          Already have an account? Sign in
                        </Link>
                      </Grid>
                    </Grid>
                  </form>
                </div>
              </Container>
              </Paper>
            </Grid>
          </Grid>
      </div>
      );}

export default Register