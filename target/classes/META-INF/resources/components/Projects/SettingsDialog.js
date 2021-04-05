import React, { useState } from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import './SettingsDialog.css'

function SettingsDialog(props) {
  const {isOpen, name, userName, currentOnlineStatus, closeDialog, saveSettings } = props;
  const [updatedName, setUpdatedName] = useState(name);
  const [updatedUsername, setUpdatedUsername] = useState(userName);
  const [showOnlineStatus, setShowOnlineStatus] = useState(currentOnlineStatus);

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <div className="SettingsDialog_container">
          
          <span className="SettingsDialog_message">Content</span>

          <div className="SettingsDialog_button_container">
            <button className="SettingsDialog_button left" onClick={closeDialog}>CLOSE</button>
            <button className="SettingsDialog_button right" onClick={saveSettings}>SAVE</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsDialog
