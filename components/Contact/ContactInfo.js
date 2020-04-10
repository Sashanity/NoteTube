import React, { Component } from 'react';

class ContactInfo extends Component {
    render() {
        return (
            <section className="pt-100 pb-70">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="contact-info-box">
                                <div className="icon">
                                    <i className="flaticon-email"></i>
                                </div>
                                <h3>Email Here</h3>
                                <p>
                                    admin@taiker.com
                                </p>
                                <p>
                                    contactinfo@taiker.com
                                </p>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="contact-info-box">
                                <div className="icon">
                                    <i className="flaticon-phone-call"></i>
                                </div>
                                <h3>Location Here</h3>
                                <p>2750 Quadra Street Victoria Road, New York, Canada</p>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-6 offset-lg-0 offset-md-3 offset-sm-3">
                            <div className="contact-info-box">
                                <div className="icon">
                                    <i className="flaticon-marker"></i>
                                </div>
                                <h3>Call Here</h3>
                                <p>+123 456 7890</p>
                                <p>+241 452 4526</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default ContactInfo;