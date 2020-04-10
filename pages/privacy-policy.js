import React, { Component } from 'react';
import Navbar from '../components/Layout/Navbar';
import PageHeader from '../components/Common/PageHeader';
import PrivacyPolicyContent from '../components/PrivacyPolicy/PrivacyPolicyContent';
import Footer from '../components/Layout/Footer';

class PrivacyPolicy extends Component {
    render() {
        return (
            <React.Fragment>
                <Navbar />
                <PageHeader 
                    pageTitle="Privacy Policy" 
                    breadcrumbTextOne="Home" 
                    breadcrumbUrl="/" 
                    breadcrumbTextTwo="Privacy Policy" 
                />
                <PrivacyPolicyContent />
                <Footer/>
            </React.Fragment>
        );
    }
}

export default PrivacyPolicy;