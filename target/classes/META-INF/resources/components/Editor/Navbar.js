import React from 'react'
import './Navbar.css'
import './Profile.js'
import Profile from './Profile.js';


function Navbar(props) {
  const {title, updateName} = props;

  const handleChange = elt => {
    updateName(elt.target.value);
  }

  return (
    <div>
      <div className="Navbar_container">
        <Profile
          name="Mufaro"
          side="L"
          active={true}/>

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
          name="Cynthia"
          side="R"
          active={false}/>
      </div>
    </div>
  )
}

export default Navbar
