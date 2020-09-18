import React, { useContext } from 'react';
import { UserContext } from '../../UserContext';
import { Layout, Header, Navigation, Drawer, Content } from 'react-mdl';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
// import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import { logout } from '../../actions/auth';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import logoNoteTube from '../../img/logoNoteTube.png'

/* Uses a header that scrolls with the text, rather than staying locked at the top */
const Navbar = () => {
	const history = useHistory();
	const { user, setUser } = useContext(UserContext);
	if (localStorage.getItem('token')) {
		return (
			<div style={{ height: '64px', position: 'relative' }}>
				<Layout>
					<Header className='header-color' title={<img src={logoNoteTube} alt="LogoNoteTube" width='120px' />} scroll>
						<Navigation>
							<Link to='/Home'>
								<SearchIcon></SearchIcon>
							</Link>
							<Link to='/personalSpace'>Personal Workspace</Link>
							<Link to='#'>
								<AccountCircleIcon></AccountCircleIcon>
							</Link>
						</Navigation>
					</Header>
					<Drawer title='NoteTube'>
						<Navigation>
							<Link to='#'>Profile</Link>
							<Link to='/uploadNotes'>Upload Notes</Link>
							<Link to='#'>Followers</Link>
							<Button onClick={logout(history, setUser)}>Logout</Button>
						</Navigation>
					</Drawer>
					<Content />
				</Layout>
			</div>
		);
	} else {
		return <div></div>;
	}
};

export default Navbar;
