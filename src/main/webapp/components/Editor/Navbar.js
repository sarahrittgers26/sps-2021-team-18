import iReact from 'react';
import { useSelector } from 'react-redux';
import './Navbar.css';
import Profile from './Profile.js';
import SocketSingleton from '../../middleware/socketMiddleware';
import { ACTION } from '../../actions/types.js';

const Navbar = (props) => {
  const { title, updateName, projectName, handleSave, 
	  history, socket, projectid, collaborator } = props;
  const user = useSelector((state) => state.userReducer);
  const { collaboratorName } = useSelector((state) => state.projectReducer);

  const handleChange = elt => {
    let msg = JSON.stringify({ type: ACTION.SEND_TITLE, id: projectid, 
	    data: elt.target.value })
    socket.send(msg);
  }
  const socket = SocketSingleton.getInstance();

  // called when user clicks on Profile
  const handleReturn = () => {
    dispatch(updateCanEdit(false));
    dispatch(clearProject());
    let msg = JSON.stringify({ id: collaborator, type: ACTION.SEND_LEFT, 
	    data: collaboratorName });
    socket.send(msg);
    history.push('/projects');
  }


  return (
    <div>
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
          name="Mufaro Makiwa"
          avatar="1"
          side="R"
          active={true}
          isUser={true}
          handleSave={handleSave}
          history={history}/>
      </div>
    </div>
  );
}

export default Navbar
