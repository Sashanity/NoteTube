import React, { Component } from 'react';

class Loader extends Component {
    render() {
        return (
            <React.Fragment>
                <div className={`preloader ${this.props.loading ? '' : 'preloader-deactivate'}`}>
                    <div className="loader">
                        <div className="shadow"></div>
                        <div className="box"></div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Loader;