import React from 'react';
import './sidebar.css';


function SidebarRow({Icon, title}){

return(
<div className="SidebarRow">
  <Icon/>
    <h5>{title}</h5>
</div>

);


}
export default SidebarRow