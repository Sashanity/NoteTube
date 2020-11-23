import axios from 'axios';
const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};
// Register User
export const register = async (
  firstname,
  lastname,
  email,
  username,
  password,
  confirmPassword,
  setUser,
  history
) => {
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

    setAuthHeader(res.data.token);
    setUser(res.data.token);
    history.push('/Home');
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

// Login User
export const login = async (emailUsername, password, history, setUser) => {
  const email = emailUsername;
  const body = JSON.stringify({
    email,
    password,
  });
  try {
    const res = await axios.post('/login', body, config);
    const tokenVerification = await verifyToken(res.data.token);
    if (tokenVerification === 'Successful') {
      await setAuthHeader(res.data.token);
      return false;
    }
  } catch (err) {
    return err;
  }
};

export const logout = (history, setUser) => async () => {
  console.log('errors?');
  setUser(null);
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
  history.push('/');
};

export const verifyToken = async (token) => {
  try {
    const res = await axios.get(
      '/verifyToken',
      { params: { token: token } },
      config
    );
    return res.data.Status;
  } catch (err) {
    console.log(err);
  }
};

const setAuthHeader = (token) => {
  const Token = `${token}`;
  localStorage.setItem('token', Token);
  axios.defaults.headers.common['Authorization'] = Token;
};
