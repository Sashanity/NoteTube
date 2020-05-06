import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { Link, Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import FormHelperText from '@material-ui/core/FormHelperText';

import { register } from '../../actions/auth.js';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		padding: theme.spacing(10),
	},
	paper: {
		marginTop: theme.spacing(3),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		height: theme.spacing(75),
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

const Register = ({ register, isAuthenticated }) => {
	const [formState, setForm] = useState({
		firstname: '',
		firstnameError: '',
		lastname: '',
		lastnameError: '',
		email: '',
		emailError: '',
		username: '',
		usernameError: '',
		password: '',
		passwordError: '',
		confirmPassword: '',
		confirmPasswordError: '',
	});
	const {
		firstname,
		firstnameError,
		lastname,
		lastnameError,
		email,
		emailError,
		username,
		usernameError,
		password,
		passwordError,
		confirmPassword,
		confirmPasswordError,
	} = formState;
	const classes = useStyles();

	const onChange = (e) =>
		setForm({ ...formState, [e.target.name]: e.target.value });

	const validation = async () => {
		const { err, valid } = await register({
			firstname,
			lastname,
			email,
			username,
			password,
			confirmPassword,
		});
		if (!valid) {
			const errors = {
				emailError: err.email,
				usernameError: err.username,
				confirmPasswordError: err.confirmPassword,
			};
			if (!valid) {
				setForm({ ...formState, ...errors });
			}
			return valid;
		} else {
			return valid;
		}
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		if (await validation()) {
			setForm({
				firstname: '',
				firstnameError: '',
				lastname: '',
				lastnameError: '',
				email: '',
				emailError: '',
				username: '',
				usernameError: '',
				password: '',
				passwordError: '',
				confirmPassword: '',
				confirmPasswordError: '',
			});
		}
	};

	//Redirect if Authenticated
	if (isAuthenticated) {
		return <Redirect to='/homepage' />;
	}

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
									Register
								</Typography>
								<form className={classes.form} onSubmit={(e) => onSubmit(e)}>
									<Grid container spacing={2}>
										<Grid item xs={12} sm={6}>
											<TextField
												autoComplete='fname'
												name='firstname'
												variant='outlined'
												required
												fullWidth
												id='firstname'
												label='First Name'
												value={firstname}
												error={firstnameError}
												onChange={(e) => onChange(e)}
												autoFocus
											/>
											<FormHelperText color='red'>
												{firstnameError}
											</FormHelperText>
										</Grid>
										<Grid item xs={12} sm={6}>
											<TextField
												variant='outlined'
												required
												fullWidth
												id='lastname'
												label='Last Name'
												value={lastname}
												onChange={(e) => onChange(e)}
												name='lastname'
												error={lastnameError}
												autoComplete='lname'
											/>
											<FormHelperText color='red'>
												{lastnameError}
											</FormHelperText>
										</Grid>
										<Grid item xs={12}>
											<TextField
												error={emailError}
												variant='outlined'
												required
												fullWidth
												id='email'
												value={email}
												onChange={(e) => onChange(e)}
												label='SJSU Email Address'
												name='email'
												autoComplete='email'
											/>
											<FormHelperText error>{emailError}</FormHelperText>
										</Grid>
										<Grid item xs={12}>
											<TextField
												variant='outlined'
												error={usernameError}
												required
												fullWidth
												id='username'
												value={username}
												onChange={(e) => onChange(e)}
												label='Username'
												name='username'
												autoComplete='username'
											/>
											<FormHelperText error>{usernameError}</FormHelperText>
										</Grid>
										<Grid item xs={12}>
											<TextField
												error={passwordError}
												variant='outlined'
												required
												fullWidth
												name='password'
												label='Password'
												onChange={(e) => onChange(e)}
												value={password}
												type='password'
												id='password'
												autoComplete='current-password'
											/>
											<FormHelperText color='red'>
												{passwordError}
											</FormHelperText>
										</Grid>
										<Grid item xs={12}>
											<TextField
												error={confirmPasswordError}
												variant='outlined'
												required
												fullWidth
												name='confirmPassword'
												value={confirmPassword}
												onChange={(e) => onChange(e)}
												label='Re-enter Password'
												type='password'
												id='password'
												autoComplete='current-password'
											/>
											<FormHelperText error>
												{confirmPasswordError}
											</FormHelperText>
										</Grid>
									</Grid>
									<Button
										type='submit'
										fullWidth
										variant='contained'
										color='primary'
										className={classes.submit}
									>
										Sign Up
									</Button>
									<Grid container justify='flex-end'>
										<Grid item>
											<Link to='/login' variant='body2'>
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
	);
};

Register.propTypes = {
	register: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { register })(Register);
