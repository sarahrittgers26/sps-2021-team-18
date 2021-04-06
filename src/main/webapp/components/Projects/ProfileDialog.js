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
            Update your profile
          </span>
           
          <input 
            type="text"
            value={updatedName}
            onChange={updateName}
            placeholder="Name"
            className="Profile_input"/>

          <input 
            type="text"
            value={updatedUsername}
            onChange={updateUsername}
            placeholder="Username"
            className="Profile_input"/>


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
