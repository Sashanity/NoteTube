import React, { Component } from 'react';
import Link from 'next/link';

class Footer extends Component {
    render() {
        let currentYear = new Date().getFullYear();
        return (
            <React.Fragment>
                <section className="footer-area">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4 col-md-6 col-sm-6">
                                <div className="single-footer-widget">
                                    <h3>Contact Info</h3>

                                    <ul className="footer-contact-info">
                                        <li>
                                         
                                        </li>
                                        <li>
                                            <i className="flaticon-email"></i>
                                            <span>Do You Have a Question?</span>
                                            <Link href="#">
                                                <a>NoteTube@sjsu.edu</a>
                                            </Link>
                                        </li>
                                        <li>
                                            <i className="flaticon-social-media"></i>
                                            <span>Socials Network</span>

                                            <ul className="social">
                                                <li>
                                                    <Link href="#">
                                                        <a><i className="fab fa-twitter"></i></a>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="#">
                                                        <a><i className="fab fa-facebook-f"></i></a>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="#">
                                                        <a><i className="fab fa-instagram"></i></a>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="#">
                                                        <a><i className="fab fa-linkedin"></i></a>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="#">
                                                        <a><i className="fab fa-youtube"></i></a>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-6">
                                <div className="single-footer-widget pl-5">
                                    <h3>Quick Links</h3>

                                    <ul className="footer-quick-links">
                                        <li>
                                            <Link href="#">
                                                <a>Home</a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#">
                                                <a>About</a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#">
                                                <a>Workspace</a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#">
                                                <a>Contact</a>
                                            </Link>
                                        </li>
                                      
                                    </ul>
                                </div>
                            </div>

                         
                        </div>

                        <div className="copyright-area">
                            <div className="row align-items-center">
                                <div className="col-lg-6 col-sm-6 col-md-6">
                                    <p>
                                        <i className="flaticon-copyright"></i> Copyright {currentYear} <a href="#"  target="_blank">NoteTube</a>. 
                                        All rights reserved
                                    </p>
                                </div>

                                <div className="col-lg-6 col-sm-6 col-md-6">
                                    <ul>
                                        <li>
                                            <Link href="#">
                                                <a>Terms & Conditions</a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#">
                                                <a>Privacy Policy</a>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}

export default Footer;