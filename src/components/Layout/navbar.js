import React from 'react';
import { Layout, Header, Navigation,Drawer,Content } from 'react-mdl';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

/* Uses a header that scrolls with the text, rather than staying locked at the top */
const navbar= ({auth: { isAuthenticated, loading}, logout}) => {
    return (

<div className="demo-big-content">
    <Layout>
        <Header className="header-color"title="NoteTube" scroll>
            <Navigation>
                <Link to="#">Personal Workspace</Link>
                <Link to="#">Class Notes</Link>
                <Link to="#">About</Link>
                <Link to="#">Contact</Link>
                <Link onClick={logout} to="#!">Log Out</Link>
                <Link to="#"><AccountCircleIcon></AccountCircleIcon></Link>
            </Navigation>
        </Header>
        <Drawer title="NoteTube">
            <Navigation>
            <Link to="#">Profile</Link>
                <Link to="#">Upload Notes</Link>
                <Link to="#">Followers</Link>
                <Link to="#">Contact</Link>
            </Navigation>
        </Drawer>
        <Content>
            <div className="page-content" />
           
        </Content>
    </Layout>
</div>
    )
}

navbar.PropTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logout })(navbar);