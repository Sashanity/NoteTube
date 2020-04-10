import React, { Component } from 'react';
import Navbar from '../components/Layout/Navbar';
import Banner from '../components/HomeOne/Banner';

import Footer from '../components/Layout/Footer';

class Index extends Component {
    render() {
        return (
            <React.Fragment> 
                <Navbar />
                <Banner />
               
              
   
               
                <Footer />
            </React.Fragment>
        );
    }
}

export default Index;
