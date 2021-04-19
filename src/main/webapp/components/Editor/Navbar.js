import iReact from 'react';
import { useSelector } from 'react-redux';
import './Navbar.css';
import Profile from './Profile.js';
import { ACTION } from '../../actions/types.js';

const Navbar = (props) => {
  const { title, updateName, projectName, handleSave, 
	  history, socket, projectid } = props;
  const user = useSelector((state) => state.userReducer);
  const { collaboratorName } = useSelector((state) => state.projectReducer);
  
  socket.onmessage = (response) => {
    let message = JSON.parse(response.data);
    updateName(message.data);
  } 

  const handleChange = elt => {
    let msg = JSON.stringify({ type: ACTION.SEND_TITLE, id: projectid, 
	    data: elt.target.value })
    socket.send(msg);
  }

  return (
    <div className="Navbar_container">
      <Profile
        // name={collaboratorName}
        // avatar={collaboratorAvatar}
        name="Michael Lawes"
        avatar="3"
        email=""
        side="L"
        active={true}
        isUser={false}
        handleSave={handleSave}
        history={history}/>

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
        handleSave={handleSave}
        history={history}/>
    </div>
  );
}

export default Navbar
