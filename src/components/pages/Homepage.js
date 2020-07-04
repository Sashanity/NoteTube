import React, { Component } from 'react';
import { Grid, Cell } from 'react-mdl';
import Search from '../Layout/search'

class Landing extends Component {
  render() {
    return (
      <div className="container">
        <div className="landing-grid">
          <img src="https://www.shareicon.net/download/2015/09/18/103157_man_512x512.png" alt="avatar" className="avatar-img" />
          <div className="wrap">
            <div className="banner-text">
              <h3>Easy way to access the Class Notes</h3>
              <hr />
              <div className="search">
                <Search></Search>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Landing