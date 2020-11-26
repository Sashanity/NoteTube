import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../../UserContext';

const AuthenticatedRoute = ({ component: RouteComponent, ...rest }) => {
  const { value } = useContext(UserContext);
  return (
    <UserContext.Consumer>
      {(value) => (
        <Route
          {...rest}
          render={(routeProps) => {
            if (localStorage.getItem('token') && value.user) {
              return <RouteComponent {...routeProps} />;
            } else {
              return <Redirect to={'/'} />;
            }
          }}
        />
      )}
    </UserContext.Consumer>
  );
};

export default AuthenticatedRoute;
