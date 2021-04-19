import React from 'react';
import './ConnectedUsers.css';
import User from './User.js';

const ConnectedUsers = (props) => {
  
  const { activeUsers, contacts, onActiveUserClick, onRecentUserClick, isVisible } = props;
  const actives = activeUsers.map((user) => (
   <User
      key={user.username}
      name={user.name}
      isActive={user.isActive}
      onClick={() => onActiveUserClick(user.name, user.username, user.avatar)}
      avatar={user.avatar}/>
  ));

  const recentContacts = contacts.map((user) => (
    <User
      key={user.username}
      name={user.name}
      isActive={user.isActive}
      onClick={() => onRecentUserClick(user.username, user.name, user.isActive, user.avatar)}
      avatar={user.avatar}/>
  ));

  return (
    <div className="ConnectedUsers_container card">
      <span className="ConnectedUsers_label">Recent contacts</span>
      {recentContacts.length > 0 && isVisible? 
        recentContacts : 
        (<span className="no_users">No recent contacts</span>)}

      <span className="ConnectedUsers_label top">Active users</span>
      {actives.length > 0 && isVisible? 
        actives : 
        (<span className="no_users">No active users</span>)}
    </div>
  );
}

export default ConnectedUsers
