import React from 'react';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import { Route, Switch } from 'react-router-dom';

import Landing from "./components/Landing";

import ProtectedRoute from "./components/ProtectedRoute";
import { connect } from "react-redux";
//This is the app

function App(props) {
  const { isAuthenticated, isVerifying } = props;
  return (
    <Switch>
      <ProtectedRoute
        exact
        path="/"
        component={Landing}
        isAuthenticated={isAuthenticated}
        isVerifying={isVerifying}
      />
      <Route path="/login" component={Login} />
      <Route exact path='/register' component={Register} />
    </Switch>
  );
}
function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying
  };
}
export default connect(mapStateToProps)(App);
