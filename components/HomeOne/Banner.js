import React, { Component } from 'react';
import ReactWOW from 'react-wow';

class Banner extends Component {
    render() {
        return (
            <div className="hero-banner banner-bg2">
                <div className="d-table">
                    <div className="d-table-cell">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-9 col-md-9">
                                    <div className="hero-main-banner-content">
                                        <span className="sub-title">NoteTube</span>
                                        <h2>Easy way to access class notes</h2>
                                        
                                        <form>
                                            <input type="search" className="input-newsletter" placeholder="Enter Class Name" name="SERACH" />
                                            <button type="submit">Search</button>
                                        </form>
                                    </div>
                                </div>

                                
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shape Images */}
                <div className="shape-img1">
                    <ReactWOW delay='.9s' animation='fadeInUp'>
                        <img src={require("../../images/shape/shape1.png")} alt="image" />
                    </ReactWOW>
                </div>
                <div className="shape-img2">
                    <img src={require("../../images/shape/shape2.svg")} alt="image" />
                </div>
                <div className="shape-img3">
                    <img src={require("../../images/shape/shape3.svg")} alt="image" />
                </div>
                <div className="shape-img7">
                    <img src={require("../../images/shape/shape7.png")} alt="image" />
                </div>
                <div className="shape-img8">
                    <img src={require("../../images/shape/shape8.png")} alt="image" />
                </div>
                <div className="shape-img9">
                    <img src={require("../../images/shape/shape9.png")} alt="image" />
                </div>
              
            </div>
        );
    }
}

export default Banner;