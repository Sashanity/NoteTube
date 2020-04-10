import React, { Component } from 'react';
import Navbar from '../components/Layout/Navbar';
import PageHeader from '../components/Common/PageHeader';
import ContactForm from '../components/Contact/ContactForm';
import ContactInfo from '../components/Contact/ContactInfo';
import Footer from '../components/Layout/Footer';

class Contact extends Component {
    render() {
        return (
            <React.Fragment>
                <Navbar />

                <PageHeader 
                    pageTitle="Contact" 
                    breadcrumbTextOne="Home" 
                    breadcrumbUrl="/" 
                    breadcrumbTextTwo="Contact" 
                />
                
                <ContactForm />
                <ContactInfo />
                <Footer />
            </React.Fragment>
        );
    }
}

export default Contact;