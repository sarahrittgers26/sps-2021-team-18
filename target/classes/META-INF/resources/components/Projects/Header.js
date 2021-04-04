import React from 'react'
import './Header.css'

function Header(props) {
  const {name, email} = props;

  return (
    <div className="Header_container">
      <span className="Header_title">COLLABORATIVE CODING</span>

      <div className="Header_user">
        <div className="Header_user_details">
          <span className="Header_user_name">{name}</span>
          <span className="Header_user_email">{email}</span>
        </div>
        <div className="Header_user_icon"></div>
      </div>
    </div>
  )
}

export default Header
