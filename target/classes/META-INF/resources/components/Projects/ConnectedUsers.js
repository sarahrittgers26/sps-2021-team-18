import React from 'react'
import './ConnectedUsers.css'
import User from './User.js'

function ConnectedUsers(props) {
  
  const {active, inactive, onActiveUserClick, onInactiveUserClick} = props;
  const ActiveUsers = active.map((user) => (
    <User
      key={`User_obj_${user.id}`}
      name={user.name}
      active={true}
      onClick={() => onActiveUserClick(user.id)}/>
  ));

  const InactiveUsers = inactive.map((user) => (
    <User
      key={`User_obj_${user.id}`}
      name={user.name}
      active={false}
      onClick={() => onInactiveUserClick(user.id)}/>
  ));

  return (
    <div className="ConnectedUsers_container">
      {ActiveUsers}
      {InactiveUsers}
    </div>
  )
}

export default ConnectedUsers
