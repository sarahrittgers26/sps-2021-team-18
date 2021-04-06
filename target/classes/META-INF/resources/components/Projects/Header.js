import React, { useEffect, useRef, useState } from 'react';
import './Header.css';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';


function Header(props) {
  const {name, email, handleLogout, displayProfile} = props;
  const [displayMenu, setDisplayMenu] = useState(false);
  const menuRef = useRef();
  const iconRef = useRef();


  const handleClick = callback => {
    setDisplayMenu(prevState => !prevState);
    callback();
  }

  useEffect(() => {
    displayMenu ? menuRef.current.style.display = "flex" : menuRef.current.style.display = "none";
     const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          iconRef.current && !iconRef.current.contains(event.target) && displayMenu) {      
        setDisplayMenu(prevState => !prevState);     
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [displayMenu]);

  return (
    <div className="Header_container">
      <span className="Header_title">
        COLLABORATIVE CODING
      </span>

      <div className="Header_user">
        <div className="Header_user_details">
          <span className="Header_user_name">
            {name}
          </span>
          <span className="Header_user_email">
            {email}
          </span>
        </div>
        <div className="Header_user_icon" 
          ref={iconRef} 
          onClick={() => setDisplayMenu(prevState => !prevState)}></div>
        <div className="Header_menu" ref={menuRef}>
          <ul>
            <li onClick={() => handleClick(displayProfile)}>
              <AccountCircleIcon className="Header_menu_icon"/>
              <span>
                Profile
              </span>
            </li>
            <li onClick={() => handleClick(handleLogout)}>
              <ExitToAppIcon className="Header_menu_icon"/>
              <span>
                Logout
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header
