import React, { useEffect, useRef, useState } from 'react';
import './Header.css';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Notification from './Notification.js';
import Icon_1 from "../../images/avatar-1.png";
import Icon_2 from "../../images/avatar-2.png";
import Icon_3 from "../../images/avatar-3.png";
import Icon_4 from "../../images/avatar-4.png";
import Icon_5 from "../../images/avatar-5.png";
import Icon_6 from "../../images/avatar-6.png";
import Icon_7 from "../../images/avatar-7.png";
import Icon_8 from "../../images/avatar-8.png";
import Banner from "../../images/banner.png";


const Header = (props) => {
  const { name, email, handleLogout, displayProfile, notifications, avatar, accept, decline,
  acceptCallBack, declineCallBack, history } = props;
  const [displayMenu, setDisplayMenu] = useState(false);
  const [displayNotifications, setDisplayNotifications] = useState(false);
  const menuRef = useRef();
  const notificationsRef = useRef();
  const userIconRef = useRef();
  const notificationIconRef = useRef();


  const addAvatar = () => {
    switch (avatar) {
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


  const handleClick = callback => {
    setDisplayMenu(prevState => !prevState);
    callback();
  }

  const renderNotifications = () => {
    return notifications.map((notification) => (
      <Notification
        key={`Notification_${notifications.indexOf(notification)}`}
        collaboratorName={notification.collaboratorName}
        accept={() => accept(notification, 
		() => acceptCallBack(notification.type, notification.proj))}
        decline={() => decline(notification, 
		() => declineCallBack(notification.collaborator, notification.type))}
        isNewProject={notification.isNewProject}
        projectTitle={notification.projectTitle}
        collaboratorAvatar={notification.collaboratorAvatar}/>
     ));
  }


  useEffect(() => {
    displayNotifications ? notificationsRef.current.style.display = "flex" : notificationsRef.current.style.display = "none";
     const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target) && 
          notificationIconRef.current && !notificationIconRef.current.contains(event.target) && displayNotifications) {      
        setDisplayNotifications(false);     
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [displayNotifications]);


  useEffect(() => {
    displayMenu ? menuRef.current.style.display = "flex" : menuRef.current.style.display = "none";
     const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          userIconRef.current && !userIconRef.current.contains(event.target) && displayMenu) {      
        setDisplayMenu(false);     
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [displayMenu]);

  const reload = () => {
    history.push("/projects");
  }

  return (
    <div className="Header_container">
      <div className="Banner">
        <img src={Banner} alt="Banner" className="main_icon" onClick={reload}/>
      </div>

      <div className="Header_user">
        <div 
          className={`Header_notifications_icon ${notifications.length > 0 && !displayNotifications ? 
            "notification_animation" : ""}`}
          ref={notificationIconRef}>
          <NotificationsIcon style={{ fontSize: 40 }}
          onClick={() => setDisplayNotifications(prevState => !prevState)}/>

          {notifications.length > 0 && (
            <div className="Notifications_count_container">
              <span className="Notifications_count">{notifications.length}</span>
            </div>)}
        </div>

        <div className="Header_user_icon" 
          ref={userIconRef} 
          onClick={() => setDisplayMenu(prevState => !prevState)}>
          {avatar !== "0" ?
            (<img src={addAvatar()} className="current_icon" alt="Current avatar"/>) : 
            (<AccountCircleIcon style = {{fontSize: 40}} />)}
        </div>

        <div className="Header_notifications menu" ref={notificationsRef}>
          {notifications.length > 0 ? ( 
            <div className="Notification_main">
              <span className="Notifications_title">Notifications</span>          
              {renderNotifications()}
            </div>
                    
            ) : (
            <span className="no_notifications">
              You do not have any notifications
            </span>
          )}       
        </div>


        <div className="Header_menu menu" ref={menuRef}>
          <div className="Header_user_details">
            <span className="Header_user_name">
              {name}
            </span>
            <span className="Header_user_email">
              {email}
            </span>
          </div>
          <ul>
            <li onClick={() => handleClick(displayProfile)}>
              <AccountCircleIcon className="Header_menu_icon"/>
              <span>
                Profile
              </span>
            </li>
            <li onClick={() => handleClick(handleLogout)}>
              <ExitToAppIcon className="Header_menu_icon"/>
              <span>
                Logout
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header
