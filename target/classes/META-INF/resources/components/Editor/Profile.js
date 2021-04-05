import React from 'react';
import './Profile.css';

function Profile(props) {
  const {name, email, side, active} = props;

  return (
    <div className={`Profile_container ${side === "R" ? "Profile_flipped" : ""}`}>
      <div className="Profile_image">
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
    </div>
  )
}

export default Profile
