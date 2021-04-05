import React from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import './ConnectionDialog.css';
import ProgressSpinner from './ProgressSpinner.js';

function ConnectionDialog(props) {
  const { collaborator, isOpen, closeDialog } = props;

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
      </DialogContent>
    </Dialog>
  )
}

export default ConnectionDialog
