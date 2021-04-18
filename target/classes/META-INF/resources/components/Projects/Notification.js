import React from 'react'
import "./Notification.css"


function Notification(props) {
  const {collaboratorName } = props;
  
  return (
    <div className="Notification_container">
      <div className="user_icon"></div>

      <div className="Notification_side">     
        <span className="Notification_title">
          {collaboratorName} is inviting you to work on a project
        </span>

        <div className="Notification_buttons">
        <button className="Notification_button_decline">DECLINE</button>
        <button className="Notification_button_accept">ACCEPT</button>
      </div>   
      </div> 
    </div>
  )
}

export default Notification
