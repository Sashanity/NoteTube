import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../../UserContext';

const RedirectOnceLoggedIn = ({ component: RouteComponent, ...rest }) => {
  const { value } = useContext(UserContext);
  return (
    <UserContext.Consumer>
      {(value) => (
        <Route
          {...rest}
          render={(routeProps) => {
            if (value.user) {
              return <Redirect to={'/Home'} />;
            } else {
              return <RouteComponent {...routeProps} />;
            }
          }}
        />
      )}
    </UserContext.Consumer>
  );
};

export default RedirectOnceLoggedIn;
