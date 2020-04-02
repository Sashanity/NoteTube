import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <Fragment>
            <Link to = '/register'>
                Register
            </Link>
            <br></br>
            <Link to = '/login'>
                Login
            </Link>
        </Fragment>
    )
}

export default Landing