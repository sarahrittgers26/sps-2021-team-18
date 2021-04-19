import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Navbar.css';
import Profile from './Profile.js';
import { updateTitle } from '../../actions';

const Navbar = (props) => {
  const { updateName, projectName, handleSave, history } = props;
  const user = useSelector((state) => state.userReducer);
  const { collaboratorName, collaboratorAvatar } = useSelector((state) => state.projectReducer);
  const dispatch = useDispatch();

  const handleChange = elt => {
    updateName(elt.target.value);
    dispatch(updateTitle(elt.target.value));
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
            placeholder="Project title"
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
