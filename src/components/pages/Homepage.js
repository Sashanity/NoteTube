import React, { Component } from 'react';
import { Grid, Cell } from 'react-mdl';
import Search from '../Layout/search'

class Landing extends Component {
  render() {
    return(
      <div className="container">
    
      <div className="landing-grid" style={{width: '100%', margin: 'auto'}}>
      <Grid >
        <Cell col={12}>
          <img
            src="https://www.shareicon.net/download/2015/09/18/103157_man_512x512.png"
            alt="avatar"
            className="avatar-img"
            />

          <div className="banner-text">
            <h3>Easy way to access the class notes</h3>

          <hr/>

        <p><Search></Search></p>

 
          </div>
        </Cell>
      </Grid>
    </div>
    </div>
  
    
    )
  }
}

export default Landing;