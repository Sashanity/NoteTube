import axios from 'axios';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT
} from './types';
import setAuthToken from '../utils/setAuthToken';

// Load User
export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {
        const res = await axios.get('/api/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })

    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}



// Register User
export const register = ({
    firstName,
    lastName,
    email,
    username,
    password
}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({
        firstName,
        lastName,
        email,
        username,
        password
    });
    try {
        const res = await axios.post('/api/users', body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser())
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {

        }
        dispatch({
            type: REGISTER_FAIL
        })
    }
}





// Login User
export const login = (emailUsername, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({
        emailUsername,
        password
    });
    try {
        const res = await axios.post('/api/auth', body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser())
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {

        }
        dispatch({
            type: LOGIN_FAIL
        })
    }
}

//Logout / Clear Profile 
export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT
    });
}