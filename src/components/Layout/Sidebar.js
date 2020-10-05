

import './sidebar.css';
import Container from './Container';

import React, { Component } from 'react'

export default class Sidebar extends Component {
  buttons = [...this.props.buttons]

  getButtonsUsingMap = () => {
    return this.buttons.map((b) => {
      return <Container triggerText={b} text={this.data2} />
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