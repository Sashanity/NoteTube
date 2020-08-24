import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/Layout/navbar';
import Footer from './components/Layout/footer';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Homepage from './components/pages/Homepage';
import Landing from './components/pages/Landing';
import SearchOverview from './components/pages/SearchOverview';
import { UserContext } from './UserContext';
import AuthenticatedRoute from './components/routes/AuthenticatedRoute';
import RedirectOnceLoggedIn from './components/routes/RedirectOnceLoggedIn';

//This is the app
const App = () => {
	const [user, setUser] = useState(null);

	const User = useMemo(() => ({ user, setUser }), [user, setUser]);

	return (
		<Router>
			<UserContext.Provider value={User}>
				<Navbar />
				<div className='container'>
					<Switch>
						<RedirectOnceLoggedIn exact path='/' component={Landing} />
						<AuthenticatedRoute exact path='/homepage' component={Homepage} />
						<AuthenticatedRoute
							exact
							path='/searchOverview'
							component={SearchOverview}
						/>
						<RedirectOnceLoggedIn exact path='/register' component={Register} />
						<RedirectOnceLoggedIn exact path='/login' component={Login} />
					</Switch>
				</div>
				<Footer />
			</UserContext.Provider>
		</Router>
	);
};

export default App;
