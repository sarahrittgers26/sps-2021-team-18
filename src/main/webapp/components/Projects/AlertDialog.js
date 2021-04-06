import React from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import './AlertDialog.css'

function AlertDialog(props) {
  const {isOpen, closeDialog, message} = props;

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <div className="AlertDialog_container">
          <div className="AlertIcon_container">
            <ErrorOutlineIcon style={{ fontSize: 40, color: "gray" }}/>
          </div>
          <span className="AlertDialog_message">{message}</span>

          <div className="AlertDialog_button_container">
            <button className="AlertDialog_button" onClick={closeDialog}>CLOSE</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AlertDialog
