import React, { useRef } from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import './ConnectionDialog.css';
import ProgressSpinner from './ProgressSpinner.js';
import { createProject, loadUsers, selectCollab, updateCanEdit } from '../../actions';
import { ACTION } from '../../actions/types.js'

const ConnectionDialog = (props) => {
  const dispatch = useDispatch();
  const { collaboratorId, collaboratorName, isOpen, closeDialog, fromProject, 
	  message, socket, isActive } = props;
  const optionsRef = useRef();
  const user = useSelector((state) => state.userReducer);
  const { activeProject, title } = useSelector((state) => state.projectReducer);

  socket.onmessage = (response) => {
    let message = JSON.parse(response.data)
    let type = message.data.split("-")
    let answer = type[0];
    switch (message.type) {
      case "REC_CREATE_PING":
        if(answer === "yes"){
	   newProject();
        } else {
          closeDialog();
        }
	break;
      case "REC_CONTINUE_PING":
        if(answer === "yes"){
	  dispatch(selectCollab({ username: collaboratorId, name: collaboratorName, 
		  avatar: type[1] }));
	  dispatch(updateCanEdit(true)); 
        } else {
          closeDialog();
        }
	break;
      default:
    }
  }

  const displayConnectionStatus = () => {
    optionsRef.current.classList.add("ConnectionDialog_hide_options");
    if (isActive) {
      if (fromProject) {
        let data = `continue=${user.username}=${user.name}=${user.avatar}=${activeProject}=${title}`;
        let msg = JSON.stringify({ id: collaboratorId, type: ACTION.PING_USER, data: data })
        socket.send(msg)
        console.log(msg);
      } else {
        let data = `create=${user.username}=${user.name}=${user.avatar}`;
        let msg = JSON.stringify({ id: collaboratorId, type: ACTION.PING_USER, data: data })
        socket.send(msg)
        console.log(msg);
      }
    } else {

    }
  }

  const newProject = () => {
    dispatch(createProject({ username: user.username, 
	    collaborator: collaboratorId, title: "New Project" }));
    closeDialog();
    dispatch(loadUsers(user.username));
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        
        <div className="ConnectionDialog_container"> 
          <span className="ConnectionDialog_header">
            Connecting
          </span>
          <span className="ConnectionDialog_summary">
            {`Waiting for ${collaboratorName} to connect...`}
          </span>
          <ProgressSpinner />
          <div className="ConnectionDialog_button_container">
            <button className="ConnectionDialog_button" onClick={closeDialog}>
              CANCEL
            </button>
          </div>
        </div>
        
        <div className="ConnectionDialog_options" ref={optionsRef}>
          <span className="ConnectionDialog_header">
            Invite to collaborate?
          </span>
          <div className="Connection_Body">
          </div>
          <span className="ConnectionDialog_alert"> 
            {message}
          </span>
          <div className="Connection_confirm_button_container">
            <button className="Connection_confirm_button left" onClick={displayConnectionStatus}>
              YES
            </button>
            <button className="Connection_confirm_button right" onClick={closeDialog}>
              NO
            </button>
          </div>
        </div>
	      
      </DialogContent>
    </Dialog>
  );
}

export default ConnectionDialog
