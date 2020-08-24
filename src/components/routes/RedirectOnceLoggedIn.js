import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const RedirectOnceLoggedIn = ({ component: RouteComponent, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(routeProps) =>
				localStorage.getItem('token') ? (
					<Redirect to={'/homepage'} />
				) : (
					<RouteComponent {...routeProps} />
				)
			}
		/>
	);
};

export default RedirectOnceLoggedIn;
