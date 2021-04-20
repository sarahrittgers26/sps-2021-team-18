import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Navbar.css';
import Profile from './Profile.js';
import { ACTION } from '../../actions/types.js';
import { updateCanEdit, clearProject } from '../../actions';

const Navbar = (props) => {
  const { title, projectName, handleSave, 
	  history, socket, projectid, collaborator, collaboratorName, 
	  collaboratorAvatar } = props;
  const user = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const handleChange = elt => {
    let msg = JSON.stringify({ type: ACTION.SEND_TITLE, id: projectid, 
	    data: elt.target.value })
    socket.send(msg);
    console.log(msg);
  }

  // called when user clicks on Profile
  const handleReturn = () => {
    dispatch(updateCanEdit(false));
    dispatch(clearProject());
    let msg = JSON.stringify({ id: collaborator, type: ACTION.SEND_LEFT, 
	    data: collaboratorName });
    socket.send(msg);
    console.log(msg);
    history.push('/projects');
  }


  return (
    <div>
      <div className="Navbar_container">
        <Profile
          // name={collaboratorName}
          // avatar={collaboratorAvatar}
          name={collaboratorName}
          avatar={collaboratorAvatar}
          email=""
          side="L"
          active={true}
          isUser={false}
	  handleReturn={handleReturn}
          handleSave={handleSave}/>

        <div className="Navbar_title_container">
          <input 
            type="text"
            className="Navbar_title"
            placeholder={title}
            name="title_input" 
            autoComplete="off" 
            id="title_input"
            value={projectName}
            onChange={handleChange}/>
        </div>
        
        <Profile
          // name={user.name}
          // avatar={user.avatar}
          name={user.name}
          avatar={user.avatar}
          side="R"
          active={true}
          isUser={true}
	  handleReturn={handleReturn}
          handleSave={handleSave}/>
      </div>
    </div>
  );
}

export default Navbar
