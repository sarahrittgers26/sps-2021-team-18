import React from 'react'
import './User.css'

function User(props) {
  const {name, active} = props;
  return (
    <div className="User_container">
      <div className="User_image">
        <div className={`User_activity ${active ? "active" : "inactive"}`}></div>
      </div>
      <span className="User_name">{name}</span>
    </div>
  )
}

export default User

