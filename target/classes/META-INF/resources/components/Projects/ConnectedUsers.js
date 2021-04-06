import React from 'react';
import './ConnectedUsers.css';
import User from './User.js';

function ConnectedUsers(props) {
  
  const {active, recent, onActiveUserClick, onRecentUserClick} = props;
  
  const activeUsers = active.map((user) => (
    <User
      key={`User_obj_${user.id}`}
      name={user.name}
      active={true}
      onClick={() => onActiveUserClick(user.name, user.id)}/>
  ));

  const recentUsers = recent.map((user) => (
    <User
      key={`User_obj_${user.id}`}
      name={user.name}
      active={user.online}
      onClick={() => onRecentUserClick(user.name, user.id, user.online)}/>
  ));

  return (
    <div className="ConnectedUsers_container card">
      <span className="ConnectedUsers_label">Recent contacts</span>
      {recent.length > 0 ? 
        recentUsers : 
        (<span className="no_users">No recent contacts.</span>)}
    <span className="ConnectedUsers_label top">Active users</span>
      {active.length > 0 ? 
        activeUsers : 
        (<span  className="no_users">No active users.</span>)}
    </div>
  );
}

export default ConnectedUsers
