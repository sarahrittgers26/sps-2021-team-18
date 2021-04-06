import React, { useRef } from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import './ConnectionDialog.css';
import ProgressSpinner from './ProgressSpinner.js';

function ConnectionDialog(props) {
  const { collaborator, isOpen, closeDialog, message } = props;
  const optionsRef = useRef();

  const displayConnectionStatus = () => {
    optionsRef.current.classList.add("ConnectionDialog_hide_options");
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <div className="ConnectionDialog_container">
          <span className="ConnectionDialog_header">
            Connecting
          </span>
          <span className="ConnectionDialog_summary">
            {`Waiting for ${collaborator} to connect...`}
          </span>
          <ProgressSpinner />
          <div className="ConnectionDialog_button_container">
            <button className="ConnectionDialog_button" onClick={closeDialog}>CANCEL</button>
          </div>
        </div>

        <div className="ConnectionDialog_options" ref={optionsRef}>
          <span className="ConnectionDialog_header">
            Invite to collaborate?
          </span>

          <span className="ConnectionDialog_alert"> 
            {message}
          </span>

          <div className="Connection_confirm_button_container">
            <button className="Connection_confirm_button left" onClick={closeDialog}>CANCEL</button>
            <button className="Connection_confirm_button right" onClick={displayConnectionStatus}>CONTINUE</button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConnectionDialog
