import React from 'react';

import './sidebar.css';
import Container from './Container';
import triggerText from './TriggerButton';

function Sidebar() {
  const triggerText = 'Upload Notes';
  const onSubmit = (event) => {
    event.preventDefault(event);
    console.log(event.target.name.value);
    console.log(event.target.email.value);
  };
  return (
    <div className="sidebar">
      <Container triggerText={triggerText} onSubmit={onSubmit} />
    </div>
  );


}
export default Sidebar