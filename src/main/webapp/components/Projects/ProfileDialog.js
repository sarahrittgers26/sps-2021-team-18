import React, { useState } from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import './ProfileDialog.css'
import Icon_1 from "../../images/avatar-1.png";
import Icon_2 from "../../images/avatar-2.png";
import Icon_3 from "../../images/avatar-3.png";
import Icon_4 from "../../images/avatar-4.png";
import Icon_5 from "../../images/avatar-5.png";
import Icon_6 from "../../images/avatar-6.png";
import Icon_7 from "../../images/avatar-7.png";
import Icon_8 from "../../images/avatar-8.png";

const ProfileDialog = (props) => {
  const { isOpen, name, currentOnlineStatus, closeDialog, saveProfile } = props;
  const [updatedName, setUpdatedName] = useState(name);
  const [updatedPassword, setUpdatedPassword] = useState("");
  const [showOnlineStatus, setShowOnlineStatus] = useState(currentOnlineStatus);

  const updateName = elt => {
    setUpdatedName(elt.target.value)
  }

  const updatePassword = elt => {
    setUpdatedPassword(elt.target.value)
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <div className="ProfileDialog_container">

          <span className="ProfileDialog_header">
            Profile information
          </span>

          <div className="Update_profile_pic">
            <div className="Profile_current">
            </div>

            <div className="Profile_new">    
              <span>Select new avatar</span>
              <div className="profile_icons">              
                <img src={Icon_1} className="new_icon" alt="Icon Option 1"/>     
                <img src={Icon_2} className="new_icon" alt="Icon Option 2"/> 
                <img src={Icon_3} className="new_icon" alt="Icon Option 3"/> 
                <img src={Icon_4} className="new_icon" alt="Icon Option 4"/> 
                <img src={Icon_5} className="new_icon" alt="Icon Option 5"/> 
                <img src={Icon_6} className="new_icon" alt="Icon Option 6"/> 
                <img src={Icon_7} className="new_icon" alt="Icon Option 7"/> 
                <img src={Icon_8} className="new_icon" alt="Icon Option 8s"/>          
              </div>
              
            </div>
          </div>

          <div className="ProfileDialog_inputs">
            <label htmlFor="name_input" className="input_container input_left">
              <span className="Profile_input_label">
                Name
              </span>
              <input 
                type="text"
                id="name_input"
                name="name_input"
                value={updatedName}
                onChange={updateName}
                placeholder="Change name"
                className="Profile_input"/>
            </label>
            
            <label htmlFor="username_input" className="input_container input_right">
              <span className="Profile_input_label">
                Password
              </span>
              <input 
                type="password"
                id="username_input"
                name="username_input"
                onChange={updatePassword}
                placeholder="Change password"
                className="Profile_input"/>
            </label>       
          </div> 

          <div className="ProfileDialog_toggle_container">
            <label htmlFor="status_toggle" className="Profile_toggle">
              <input
                type="checkbox"
                id="status_toggle"
                name="status_toggle"
                checked={showOnlineStatus}
                onChange={() => setShowOnlineStatus(prevState => !prevState)}
                className="Profile_toggle_input"/>
              <div className="Profile_toggle_fill"></div>   
              <span className="Toggle_label">
                Display online status 
              </span>       
            </label>

            <span className="online_status_message">
              If you do not display your online status, other users will not you are online
            </span>
          </div>

          <div className="ProfileDialog_button_container">
            <button className="ProfileDialog_button left" onClick={closeDialog}>CLOSE</button>
            <button 
              className="ProfileDialog_button right" 
              onClick={() => saveProfile(updatedName, updatedPassword, showOnlineStatus)}>SAVE</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileDialog
