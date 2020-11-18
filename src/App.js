import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/Layout/navbar';
import Footer from './components/Layout/footer';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Landing from './components/pages/Landing';
import Home from './components/pages/Home';
import { UserContext } from './UserContext';
import AuthenticatedRoute from './components/routes/AuthenticatedRoute';
import RedirectOnceLoggedIn from './components/routes/RedirectOnceLoggedIn';
import PersonalSpace from './components/pages/personalSpace';
import Modal from './components/Layout/Modal';



import Editor from './components/editor/editor';

import MyEditor from './components/editor/editor';
// import MyDocument from './components/editor/topdf';


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
						<AuthenticatedRoute exact path='/Home' component={Home} />
						<RedirectOnceLoggedIn exact path='/register' component={Register} />
						<RedirectOnceLoggedIn exact path='/login' component={Login} />
						<AuthenticatedRoute exact path="/personalSpace" component={PersonalSpace} />
						{/* <Route exact path="/Modal" component={Modal} /> */}
						<Route exact path='/editor' component={MyEditor} />
						{/* <Route exact path='/editor' component={Editor} /> */}

					</Switch>
				</div>
				<Footer />
			</UserContext.Provider>
		</Router>
	);
};

export default App;
