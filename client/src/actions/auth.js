import axios from 'axios';
import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
} from './types';
import setAuthToken from '../utils/setAuthToken';

// Load User
export const loadUser = () => async (dispatch) => {
	if (localStorage.token) {
		setAuthToken(localStorage.token);
	}

	try {
		const res = await axios.get('/auth');
		dispatch({
			type: USER_LOADED,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: AUTH_ERROR,
		});
	}
};

// Register User
export const register = ({
	firstname,
	lastname,
	email,
	username,
	password,
	confirmPassword,
}) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};
	const body = JSON.stringify({
		firstname,
		lastname,
		email,
		username,
		password,
		confirmPassword,
	});
	try {
		const res = await axios.post('/signup', body, config);
		dispatch({
			type: REGISTER_SUCCESS,
			payload: res.data,
		});

		dispatch(loadUser());
		return { err: '', valid: true };
	} catch (err) {
		const errors = err.response.data;
		if (errors) {
			console.log(errors);
			dispatch({
				type: REGISTER_FAIL,
			});
			return { err: errors, valid: false };
		}
	}
};

// Login User
export const login = (email, password) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};
	const body = JSON.stringify({
		email,
		password,
	});
	try {
		const res = await axios.post('/login', body, config);
		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data,
		});
		dispatch(loadUser());
		return { err: '', valid: true };
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			dispatch({
				type: LOGIN_FAIL,
			});
			return { err: errors, valid: false };
		}
	}
};

//Logout / Clear Profile
export const logout = () => (dispatch) => {
	dispatch({
		type: LOGOUT,
	});
};
