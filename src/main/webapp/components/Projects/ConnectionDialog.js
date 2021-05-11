import React, { useRef } from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import './ConnectionDialog.css';
import ProgressSpinner from './ProgressSpinner.js';
import { updateEdit, createProject, loadProjects, deleteProject, selectCollab } from '../../actions';
import { ACTION } from '../../actions/types.js'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const ConnectionDialog = (props) => {
  const dispatch = useDispatch();
  const { collaboratorId, collaboratorName, isOpen, closeDialog, fromProject, 
	  message, socket, isActive, notifications, isDeletion } = props;
  const optionsRef = useRef();
  const user = useSelector((state) => state.userReducer);
  const { activeProject, title } = useSelector((state) => state.projectReducer);


  socket.onmessage = (response) => {
    let message = JSON.parse(response.data)
    let type = message.data.split("=");
    let answer = type[0];
    switch (message.type) {
      case ACTION.REC_CREATE_PING:
        if(answer === "yes"){
	        newProject();
        } else {
          closeDialog();
        }
	      break;
      case ACTION.REC_CONTINUE_PING:
        if(answer === "yes"){
          dispatch(selectCollab({ username: collaboratorId, name: collaboratorName, 
            avatar: type[1] }));
          dispatch(updateEdit(true));
        } else {
          closeDialog();
        }
	      break;
      case ACTION.REC_DELETE_PING:
        if (answer === "yes") {
          dispatch(deleteProject(activeProject));
          closeDialog();
          dispatch(loadProjects(user.username));
        } else {
          closeDialog();
        }
        break;
      default:
    }
  }

  const displayConnectionStatus = () => {
    optionsRef.current.classList.add("ConnectionDialog_hide_options");
    if (fromProject) {
      if (isDeletion) {
        for (let notification of notifications) {
          if (notification.projectid === activeProject) {
            let data = `yes=${activeProject}`;
            let msg = JSON.stringify({ id: collaboratorId, type: ACTION.DELETE_PROJECT, data: data });
            socket.send(msg);
            closeDialog();
            dispatch(loadProjects(user.username));
            return;
          }
        }
        let data = `delete=${user.username}=${user.name}=${user.avatar}=${activeProject}=${title}`;
        let msg = JSON.stringify({ id: collaboratorId, type: ACTION.PING_USER, data: data })
        socket.send(msg);
      } else {
        for (let notification of notifications) {
          if (notification.projectid === activeProject) {
            let data = `yes=${user.avatar}`;
            let msg = JSON.stringify({ id: collaboratorId, type: ACTION.REC_CONTINUE_PING, data: data })
            socket.send(msg);
            dispatch(updateEdit(true));
            return;
          }
        }
        let data = `continue=${user.username}=${user.name}=${user.avatar}=${activeProject}=${title}`;
        let msg = JSON.stringify({ id: collaboratorId, type: ACTION.PING_USER, data: data })
        socket.send(msg);
      }
    } else {
      let data = `create=${user.username}=${user.name}=${user.avatar}`;
      let msg = JSON.stringify({ id: collaboratorId, type: ACTION.PING_USER, data: data })
      socket.send(msg);
    }
  }

  const newProject = () => {
    dispatch(createProject({ username: user.username, 
	    collaborator: collaboratorId, title: "New Project" }));
    closeDialog();
    dispatch(loadProjects(user.username));
  }

  const cancelInvite = () => {
    let msg = {};
    let data = `cancel=${user.username}=${user.name}=${user.avatar}=${activeProject}=${title}`;
    msg = JSON.stringify({ id: collaboratorId, type: ACTION.PING_USER, data: data })
    socket.send(msg);
    closeDialog();
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
            <button className="ConnectionDialog_button" onClick={cancelInvite}>
              CANCEL
            </button>
          </div>
        </div>


        {!isActive && ( 
          <div className="ConnectionDialog_options">

            <div className="Icon_container">
              <ErrorOutlineIcon style={{ fontSize: 40, color: "gray" }}/>
            </div>
            <span className="AlertDialog_message">You cannot collaborate with anyone when you are appearing offline.</span>      

            <div className="AlertDialog_button_container">
            <button className="AlertDialog_button" onClick={closeDialog}>CLOSE</button>
          </div>
          </div>       
        )}
        
        {isActive && (
        <div className="ConnectionDialog_options" ref={optionsRef}>
          {isDeletion ?
          <span className="ConnectionDialog_header">
            Delete project?
          </span> : 
          <span className="ConnectionDialog_header">
            Invite to collaborate?
          </span>
          }
          
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
        </div>)}
	      
      </DialogContent>
    </Dialog>
  );
}

export default ConnectionDialog
