import React, { useState } from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import './SettingsDialog.css'

function SettingsDialog(props) {
  const {isOpen, name, username, currentOnlineStatus, closeDialog, saveSettings } = props;
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
        <div className="SettingsDialog_container">
          
          <input 
            type="text"
            value={updatedName}
            onChange={updateName}
            placeholder="Name"
            className="Settings_input"/>

          <input 
            type="text"
            value={updatedUsername}
            onChange={updateUsername}
            placeholder="Username"
            className="Settings_input"/>


          <label htmlFor="status_toggle" className="Settings_toggle">
            <input
              type="checkbox"
              id="status_toggle"
              name="status_toggle"
              checked={showOnlineStatus}
              onChange={() => setShowOnlineStatus(prevState => !prevState)}
              className="Settings_toggle_input"/>
            <div className="Settings_toggle_fill"></div>   
            <span className="Toggle_label">
              Display online status 
            </span>       
          </label>

          <div className="SettingsDialog_button_container">
            <button className="SettingsDialog_button left" onClick={closeDialog}>CLOSE</button>
            <button className="SettingsDialog_button right" onClick={saveSettings}>SAVE</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsDialog
