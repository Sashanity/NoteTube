import React, { useState, useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import FormHelperText from '@material-ui/core/FormHelperText';
import { UserContext } from '../../UserContext';
import { login } from '../../actions/auth';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		padding: theme.spacing(19),
	},
	paper: {
		marginTop: theme.spacing(5),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		height: theme.spacing(55),
		width: theme.spacing(45),
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
	const { user, setUser } = useContext(UserContext);
	const history = useHistory();
	const classes = useStyles();
	const [formState, setForm] = useState({
		emailUsername: '',
		password: '',
		passwordError: '',
	});

	const { emailUsername, password, passwordError } = formState;

	const onChange = (e) =>
		setForm({ ...formState, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();
		const res = await login(emailUsername, password, history, setUser);
		let errors;
		if (res) {
			errors = {
				passwordError: res.general,
			};
			setForm({ ...formState, ...errors });
		} else {
			setForm({
				emailUsername: '',
				password: '',
				passwordError: '',
			});
		}
	};
	return (
		<div className={classes.root}>
			<Grid container spacing={2} direction='column'>
				<Grid item xs={12} container>
					<Grid item xs={4} />
					<Paper>
						<Container component='main' maxWidth='xs'>
							<CssBaseline />
							<div className={classes.paper}>
								<Avatar className={classes.avatar}>
									<LockOutlinedIcon />
								</Avatar>
								<Typography component='h1' variant='h5'>
									Sign in
								</Typography>
								<form className={classes.form} onSubmit={(e) => onSubmit(e)}>
									<TextField
										variant='outlined'
										margin='normal'
										required
										fullWidth
										id='email'
										value={emailUsername}
										onChange={(e) => onChange(e)}
										label='SJSU Email Address or Username'
										name='emailUsername'
										autoComplete='email'
										autoFocus
									/>
									<TextField
										variant='outlined'
										margin='normal'
										required
										fullWidth
										name='password'
										value={password}
										label='Password'
										onChange={(e) => onChange(e)}
										type='password'
										id='password'
										autoComplete='current-password'
									/>
									<FormHelperText error>{passwordError}</FormHelperText>
									<FormControlLabel
										control={<Checkbox value='remember' color='primary' />}
										label='Remember me'
									/>
									<Button
										type='submit'
										fullWidth
										variant='contained'
										color='primary'
										className={classes.submit}
									>
										Sign In
									</Button>
									<Grid container>
										<Grid item xs>
											<Link href='#' variant='body2'>
												Forgot password?
											</Link>
										</Grid>
										<Grid item>
											<Link to='/register' variant='body2'>
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
};
export default Login;
