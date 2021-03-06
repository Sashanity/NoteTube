import React from 'react';

import './sidebar.css';
import Container from './Container';

function Sidebar() {
  const uploadButton = 'Upload';
  const addButton = 'New Note';
  const onSubmit = (event) => {
    event.preventDefault(event);
    console.log(event.target.name.value);
    console.log(event.target.email.value);
  };
  return (
    <div className="sidebar">
      <Container triggerText={uploadButton} onSubmit={onSubmit} />
      <Container triggerText={addButton} />
    </div>
  );
}
export default Sidebar