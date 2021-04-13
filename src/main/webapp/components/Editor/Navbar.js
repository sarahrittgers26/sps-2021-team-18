import React from 'react';
import { useSelector } from 'react-redux';
import './Navbar.css';
import Profile from './Profile.js';

const Navbar = (props) => {
  const { title, updateName, handleSave, history } = props;

  const user = useSelector((state) => state.userReducer);
  const { collaboratorName } = useSelector((state) => state.projectReducer);
  
  const handleChange = elt => {
    updateName(elt.target.value);
  }
  return (
    <div>
      <div className="Navbar_container">
        <Profile
          name={activeCollaboratorName}
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
            placeholder="TITLE" 
            name="title_input" 
            autoComplete="off" 
            id="title_input"
            value={title}
            onChange={handleChange}/>
        </div>
        
        <Profile
          name={user.name}
          email={user.username}
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
