import React from 'react'
import './Profile.css'

function Profile(props) {
  const {name, side, active} = props;

  return (
    <div className={`Profile_container ${side==="R"? "Profile_flipped": ""}`}>
      <div className="Profile_image">
        <div className={`Profile_activity ${active ? "active": "inactive"} ${side==="R" ? "right": "left"}`}></div>
      </div>
      <span className="Profile_name">{name}</span>
    </div>
  )
}

export default Profile
