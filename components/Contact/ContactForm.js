import React, { Component } from 'react';

class ContactForm extends Component {
    render() {
        return (
            <section className="contact-area ptb-100">
                <div className="container">
                    <div className="section-title">
                        <span className="sub-title">Contact Us</span>
                        <h2>Drop us Message for any Query</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    </div>

                    <div className="row align-items-center">
                        <div className="col-lg-4 col-md-4">
                            <div className="contact-image">
                                <img src={require("../../images/contact.png")} alt="image" />
                            </div>
                        </div>

                        <div className="col-lg-8 col-md-8">
                            <div className="contact-form">
                                <form id="contactForm">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-12">
                                            <div className="form-group">
                                                <input type="text" name="name" id="name" className="form-control" placeholder="Name" />
                                            </div>
                                        </div>

                                        <div className="col-lg-6 col-md-12">
                                            <div className="form-group">
                                                <input type="email" name="email" id="email" className="form-control" placeholder="Email" />
                                            </div>
                                        </div>

                                        <div className="col-lg-6 col-md-12">
                                            <div className="form-group">
                                                <input type="text" name="phone_number" id="phone_number"  className="form-control" placeholder="Phone" />
                                            </div>
                                        </div>

                                        <div className="col-lg-6 col-md-12">
                                            <div className="form-group">
                                                <input type="text" name="msg_subject" id="msg_subject" className="form-control" placeholder="Subject" />
                                            </div>
                                        </div>

                                        <div className="col-lg-12 col-md-12">
                                            <div className="form-group">
                                                <textarea name="message" className="form-control" id="message" rows="5" placeholder="Your Message"></textarea>
                                            </div>
                                        </div>

                                        <div className="col-lg-12 col-md-12 text-center">
                                            <button type="submit" className="default-btn">
                                                Send Message <span></span>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default ContactForm;