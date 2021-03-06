import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/Layout/navbar';

import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Landing from './components/pages/Landing';
import Home from './components/pages/Home';
import { UserContext } from './UserContext';
import AuthenticatedRoute from './components/routes/AuthenticatedRoute';
import RedirectOnceLoggedIn from './components/routes/RedirectOnceLoggedIn';
import PersonalSpace from './components/pages/personalSpace';

import MyEditor from './components/editor/editor';
import { verifyToken } from './actions/auth';
// import MyDocument from './components/editor/topdf';

//This is the app
const App = () => {
  useEffect(() => {
    check();
  }, []);
  const check = async () => {
    if (localStorage.getItem('token')) {
      const just = await verifyToken(localStorage.getItem('token'));
      if (just === 'Successful') {
        return true;
      } else {
        localStorage.removeItem('token');
        return false;
      }
    }
  };
  const [user, setUser] = useState(check());

  const User = useMemo(() => ({ user, setUser }), [user, setUser]);
  return (
    <Router>
      <UserContext.Provider value={User}>
        <Navbar />
        <div className='container'>
          <Switch>
            <RedirectOnceLoggedIn exact path='/' component={Landing} />
            <AuthenticatedRoute exact path='/Home' component={Home} />
            <RedirectOnceLoggedIn exact path='/register' component={Register} />
            <RedirectOnceLoggedIn exact path='/login' component={Login} />
            <AuthenticatedRoute
              exact
              path='/personalSpace'
              component={PersonalSpace}
            />
            {/* <Route exact path="/Modal" component={Modal} /> */}
            <Route exact path='/editor' component={MyEditor} />
            {/* <Route exact path='/editor' component={Editor} /> */}
          </Switch>
        </div>
      </UserContext.Provider>
    </Router>
  );
};

export default App;
