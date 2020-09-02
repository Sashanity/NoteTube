import React from 'react';
import SidebarRow from './SidebarRow';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import './sidebar.css';
import Container from './Container';
import triggerText from './TriggerButton';



function Sidebar(){
    const triggerText = 'Upload Notes';
    const onSubmit = (event) => {
      event.preventDefault(event);
      console.log(event.target.name.value);
      console.log(event.target.email.value);
    };
return(

<div className="sidebar">
<h4 className="SidebarRow">Upload Notes</h4>

<Container triggerText={triggerText} onSubmit={onSubmit} />

</div>
);


}
export default Sidebar