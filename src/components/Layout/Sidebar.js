

import './sidebar.css';
import Container from './Container';

import React, { Component } from 'react'

export default class Sidebar extends Component {
  buttons = [...this.props.buttons]

  getButtonsUsingMap = () => {
    return this.buttons.map((b) => {
      return <Container triggerText={b} />
    })
  }

  render() {

    return (
      <div className="sidebar">
        {this.getButtonsUsingMap()}
      </div>
    )
  }
}

// function Sidebar() {


//   const uploadButton = 'Upload';
//   const addButton = 'New Note';
//   const onSubmit = (event) => {
//     event.preventDefault(event);
//     console.log(event.target.name.value);
//     console.log(event.target.email.value);
//   };
//   return (
//     <div className="sidebar">
//       <Container triggerText={uploadButton}
//       // onSubmit={onSubmit} 
//       />
//       <Container triggerText={addButton} />
//     </div>
//   );
// }
// export default Sidebar