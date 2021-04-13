import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SaveIcon from '@material-ui/icons/Save';
import './Profile.css';
import { clearProject, updateCanEdit, updateProjectSelection } from '../../actions';

// Change email to some other parameter later, don't want to expose
// people's emails unnecessarily
const Profile = (props) => {
  const {name, email, side, active, isUser, handleSave, history} = props;
  const [displayMenu, setDisplayMenu] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer);
  const { activeProject } = useSelector((state) => state.projectReducer);
  const menuRef = useRef();
  const iconRef = useRef();

  const handleClick = callback => {
    setDisplayMenu(prevState => !prevState);
    callback();
  }
 
  // called when user clicks on Profile
  const handleReturn = () => {
    dispatch(updateProjectSelection({ username: user.username, 
		projectid: activeProject, isSelecting: false }));
    dispatch(updateCanEdit(false));
    dispatch(clearProject());
    history.push('/projects');
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
    <div className={`Profile_container ${side === "R" ? "Profile_flipped" : ""}`}>
      <div className="Profile_image"
          ref={iconRef} 
          onClick={() => setDisplayMenu(prevState => !prevState)}>
        <div className={`Profile_activity ${active ? "active" : "inactive"} ${side === "R" ? "right" : "left"}`}></div>
      </div>
      <div className={`Profile_details ${side === "R" ? "details_right" : "details_left"}`}>
        <span className="Profile_name">
          {name}
        </span>
        <span className="Profile_email">
          {email}
        </span>
      </div>
      {isUser ?
        <div className="Editor_profile_menu" ref={menuRef}>
          <ul>
            <li onClick={() => handleClick(handleSave)}>
              <SaveIcon className="Editor_profile_menu_icon"/>
              <span>
                Save project
              </span>
            </li>
            <li onClick={() => handleClick(handleReturn)}>
              <ExitToAppIcon className="Editor_profile_menu_icon"/>
              <span>
                Return to projects page
              </span>
            </li>
          </ul>
        </div>
       : <div ref={menuRef}></div> 
      }
    </div>
  );
}

export default Profile
