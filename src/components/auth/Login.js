import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
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
      padding: theme.spacing(19)
    },
    paper: {
      marginTop: theme.spacing(5),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: theme.spacing(55),
      width: theme.spacing(45)
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

const Login = () => {
  const classes = useStyles();
  const [formState, setForm] = useState({
    emailUsername:"",
    emailUsernameError: "",
    password: "",
    passwordError: "",
  })
  const {emailUsername, emailUsernameError, password, passwordError} = formState
 
  const onChange = e => setForm({...formState, [e.target.name]: e.target.value})

  const validation = () => {
    let valid = true;
    const errors = {
      emailUsernameError: "",
      passwordError: ""
    };
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
        emailUsername:"",
        emailUsernameError: "",
        password: "",
        passwordError: "",
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
                      Sign in
                    </Typography>
                    <form className={classes.form} onSubmit={e => onSubmit(e)}>
                      <TextField
                        error = {emailUsernameError}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        value = {emailUsername}
                        onChange={e => onChange(e)}
                        label="SJSU Email Address or Username"
                        name="emailUsername"
                        autoComplete="email"
                        autoFocus
                      />
                      <FormHelperText error>{emailUsernameError}</FormHelperText>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        value = {password}
                        label="Password"
                        onChange={e => onChange(e)}
                        type="password"
                        id="password"
                        autoComplete="current-password"
                      />
                      <FormHelperText error>{passwordError}</FormHelperText>
                      <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                      >
                        Sign In
                      </Button>
                      <Grid container>
                        <Grid item xs>
                          <Link href="#" variant="body2">
                            Forgot password?
                          </Link>
                        </Grid>
                        <Grid item>
                          <Link to = '/register' variant="body2">
                            {"Don't have an account? Sign Up"}
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
    );
  }
export default  Login
