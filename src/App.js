import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/Layout/navbar';
import Footer from './components/Layout/footer';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Homepage from './components/pages/Homepage';
import Landing from './components/pages/Landing';
import { UserContext } from './UserContext';
import AuthenticatedRoute from './components/routes/AuthenticatedRoute';

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
						<Route exact path='/' component={Landing} />
						<AuthenticatedRoute exact path='/homepage' component={Homepage} />
						<Route exact path='/register' component={Register} />
						<Route exact path='/login' component={Login} />
					</Switch>
					<Footer />
				</div>
			</UserContext.Provider>
		</Router>
	);
};

export default App;
