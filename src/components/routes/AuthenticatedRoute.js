import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AuthenticatedRoute = ({ component: RouteComponent, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(routeProps) =>
				localStorage.getItem('token') ? (
					<RouteComponent {...routeProps} />
				) : (
					<Redirect to={'/'} />
				)
			}
		/>
	);
};

export default AuthenticatedRoute;
