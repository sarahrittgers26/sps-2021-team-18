import React from 'react';
import './ConnectedUsers.css';
import User from './User.js';

function ConnectedUsers(props) {
  
  const {active, inactive, onActiveUserClick, onInactiveUserClick} = props;
  const activeUsers = active.map((user) => (
    <User
      key={`User_obj_${user.id}`}
      name={user.name}
      active={true}
      onClick={() => onActiveUserClick(user.name, user.id)}/>
  ));

  const inactiveUsers = inactive.map((user) => (
    <User
      key={`User_obj_${user.id}`}
      name={user.name}
      active={false}
      onClick={() => onInactiveUserClick(user.name)}/>
  ));

  return (
    <div className="ConnectedUsers_container card">
      {activeUsers}
      {inactiveUsers}
    </div>
  );
}

export default ConnectedUsers
