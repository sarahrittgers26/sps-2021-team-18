import React, { useEffect, useRef, useState } from 'react';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SaveIcon from '@material-ui/icons/Save';

import './Profile.css';
import Icon_1 from "../../images/avatar-1.png";
import Icon_2 from "../../images/avatar-2.png";
import Icon_3 from "../../images/avatar-3.png";
import Icon_4 from "../../images/avatar-4.png";
import Icon_5 from "../../images/avatar-5.png";
import Icon_6 from "../../images/avatar-6.png";
import Icon_7 from "../../images/avatar-7.png";
import Icon_8 from "../../images/avatar-8.png";

// Change email to some other parameter later, don't want to expose
// people's emails unnecessarily
const Profile = (props) => {
  const {name, avatar, email, side, active, isUser, handleSave, 
	  handleReturn} = props;
  const [displayMenu, setDisplayMenu] = useState(false);
  const menuRef = useRef();
  const iconRef = useRef();

  const handleClick = callback => {
    setDisplayMenu(prevState => !prevState);
    callback();
  }

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
 
  useEffect(() => {
    displayMenu ? menuRef.current.style.display = "flex" : menuRef.current.style.display = "none";
     const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          iconRef.current && !iconRef.current.contains(event.target) && displayMenu) {      
        setDisplayMenu(prevState => !prevState);     
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [displayMenu]);

  const saveProject = () => {
    setDisplayMenu(false);
    handleSave();
  }

  return (
    <div className={`Profile_container ${side === "R" ? "Profile_flipped" : ""}`}>
      <div className={`Profile_image ${!isUser ? "other_user" : ""}`}
        ref={iconRef} 
          onClick={() => setDisplayMenu(prevState => !prevState)}>
          {avatar !== "0" ?
          (<img src={addAvatar()} className="Profile_icon" alt="avatar"/>) : 
          (<AccountCircleIcon style = {{fontSize: 40}} />)}
          <div className={`Profile_activity ${active ? "active_user" : "inactive_user"} ${side === "R" ? "right" : "left"}`}></div>      </div>
      <div className={`Profile_details  ${side === "R" ? "details_right" : "details_left"}`}>
        <span className="Profile_name">
          {name}
        </span>
        <span className="Profile_email">
          {email}
        </span>
      </div>
      {isUser ?
        <div className="Editor_profile_menu" ref={menuRef}>       
          <span className="Editor_options">
            Options
          </span>         
          <ul>
            <li onClick={() => handleClick(saveProject)}>
              <SaveIcon className="Editor_profile_menu_icon"/>
              <span>
                Save project
              </span>
            </li>
            <li onClick={() => handleClick(handleReturn)}>
              <ExitToAppIcon className="Editor_profile_menu_icon"/>
              <span>
                Return to projects page
              </span>
            </li>
          </ul>
        </div>
       : <div ref={menuRef}></div> 
      }
    </div>
  );
}

export default Profile
