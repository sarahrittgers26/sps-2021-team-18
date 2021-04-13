import React, { useRef } from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import './ConnectionDialog.css';
import ProgressSpinner from './ProgressSpinner.js';
import { createProject, loadProjects } from '../../actions';

const ConnectionDialog = (props) => {
  const dispatch = useDispatch();
  const { collaborator, cname, isOpen, closeDialog, 
	  message, sendInvite, fromProject } = props;
  const optionsRef = useRef();
  const user = useSelector((state) => state.userReducer);

  const displayConnectionStatus = () => {
    optionsRef.current.classList.add("ConnectionDialog_hide_options");
    sendInvite(collaborator);
  }

  const newProject = () => {
    //console.log(`Collaborator: ${collaborator}`);
    dispatch(createProject({ username: user.username, 
	    collaborator: collaborator, title: "New Project" }));
    closeDialog();
    dispatch(loadProjects(user.username));
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <div className="ConnectionDialog_container">
	{fromProject ?
	  <div>
            <span className="ConnectionDialog_header">
              Connecting
            </span>
            <span className="ConnectionDialog_summary">
              {`Waiting for ${cname} to connect...`}
            </span>
            <ProgressSpinner />
            <div className="ConnectionDialog_button_container">
              <button className="ConnectionDialog_button" 
		onClick={closeDialog}>CANCEL</button>
            </div>
	  </div>
        :
          <div className="ConnectionDialog_options" ref={optionsRef}>
            <span className="ConnectionDialog_header">
              Create a new project?
            </span>
            <div className="Connection_Body">
            </div>
            <span className="ConnectionDialog_alert"> 
              {message}
            </span>
            <div className="Connection_confirm_button_container">
              <button className="Connection_confirm_button left" 
	  	onClick={() => newProject()}>YES</button>
              <button className="Connection_confirm_button right" 
		onClick={closeDialog}>NO</button>
            </div>
	  </div>
	}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConnectionDialog
