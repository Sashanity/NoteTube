import React, { useContext } from 'react';
import { UserContext } from '../../UserContext';
import { Layout, Header, Navigation, Drawer, Content } from 'react-mdl';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';

import { logout, verifyToken } from '../../actions/auth';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import logoNoteTube from '../../img/logoNoteTube.png';

/* Uses a header that scrolls with the text, rather than staying locked at the top */
const Navbar = () => {
  const history = useHistory();
  const { user, setUser } = useContext(UserContext);
  if (localStorage.getItem('token') && user) {
    return (
      <div style={{ height: '64px', position: 'relative' }}>
        <Layout>
          <Header
            className='header-color'
            title={<img src={logoNoteTube} alt='LogoNoteTube' width='120px' />}
            scroll
          >
            <Navigation>
              <Link to='/Home'>
                <HomeIcon></HomeIcon>
              </Link>
              <Link to='/personalSpace'>Personal Workspace</Link>
              <Link to='#'>
                <AccountCircleIcon></AccountCircleIcon>
              </Link>
              <Button onClick={logout(history, setUser)}>Logout</Button>
            </Navigation>
          </Header>
          <Content />
        </Layout>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default Navbar;
