import React, { useState } from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import './ProfileDialog.css'

function ProfileDialog(props) {
  const {isOpen, name, username, currentOnlineStatus, closeDialog, saveProfile } = props;
  const [updatedName, setUpdatedName] = useState(name);
  const [updatedUsername, setUpdatedUsername] = useState(username);
  const [showOnlineStatus, setShowOnlineStatus] = useState(currentOnlineStatus);

  const updateName = elt => {
    setUpdatedName(elt.target.value)
  }

  const updateUsername = elt => {
    setUpdatedUsername(elt.target.value)
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <div className="ProfileDialog_container">

          <span className="ProfileDialog_header">
            Profile information
          </span>

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
                placeholder="Name"
                className="Profile_input"/>
            </label>
            
            <label htmlFor="username_input" className="input_container input_right">
              <span className="Profile_input_label">
                Username
              </span>
              <input 
                type="text"
                id="username_input"
                name="username_input"
                value={updatedUsername}
                onChange={updateUsername}
                placeholder="Username"
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
              If you do not display your online status, you will not be able to see other users
              who are online.
            </span>
          </div>

          <div className="ProfileDialog_button_container">
            <button className="ProfileDialog_button left" onClick={closeDialog}>CLOSE</button>
            <button className="ProfileDialog_button right" onClick={saveProfile}>SAVE</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileDialog
