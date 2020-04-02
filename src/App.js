import React, { Fragment } from 'react';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './components/Landing';
import './App.css';

//This is the app
const  App = () =>  (
  <Router>
    <Fragment >
      <Route exact path = "/" component = {Landing}/>
      <section className = "container">
        <Switch>
          <Route exact path = '/register' component = {Register}/>
          <Route exact path = '/login' component = {Login}/>
        </Switch>
      </section>
    </Fragment>
  </Router>
);
export default App;
