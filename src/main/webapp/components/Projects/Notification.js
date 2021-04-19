import React from 'react';
import "./Notification.css";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Icon_1 from "../../images/avatar-1.png";
import Icon_2 from "../../images/avatar-2.png";
import Icon_3 from "../../images/avatar-3.png";
import Icon_4 from "../../images/avatar-4.png";
import Icon_5 from "../../images/avatar-5.png";
import Icon_6 from "../../images/avatar-6.png";
import Icon_7 from "../../images/avatar-7.png";
import Icon_8 from "../../images/avatar-8.png";


function Notification(props) {
  const {collaboratorName, accept, decline, isNewProject, projectTitle, collaboratorAvatar } = props;

  const addAvatar = () => {
    switch (collaboratorAvatar) {
      case "1":
        return Icon_1;

      case "2":
        return Icon_2;

      case "3":
        return Icon_3;

      case "4":
        return Icon_4;

      case "5":
        return Icon_5;

      case "6":
        return Icon_6;

      case "7":
        return Icon_7;

      case "8":
        return Icon_8;
      
      default:
        return;
    }   
  } 

  const getMessage = () => {
    if (isNewProject) {
      return `${collaboratorName} is inviting you to collaborate on a new project`
    } else {
      return `${collaboratorName} is inviting you to continue working on ${projectTitle}`
    }
  }
  
  return (
    <div className="Notification_container">
      <div className="user_icon">
      {collaboratorAvatar !== "0" ?
        (<img src={addAvatar()} className="current_icon" alt="Current avatar"/>) : 
        (<AccountCircleIcon style = {{fontSize: 40}} />)}
      </div>

      <div className="Notification_side">     
        <span className="Notification_title">
          {getMessage()}
        </span>

        <div className="Notification_buttons">
        <button className="Notification_button_decline" onClick={decline}>DECLINE</button>
        <button className="Notification_button_accept" onClick={accept}>ACCEPT</button>
      </div>   
      </div> 
    </div>
  )
}

export default Notification
