import React from 'react';
import { Sidebar, ProfileDropdown } from './styles';

const SidebarComponent = ({ conversations, onSelectConversation, onNewConversation, onLogout }) => {
  return (
    <Sidebar>
      <ProfileDropdown>
        <div className="dropdown">
          <span>Profile</span>
          <div className="dropdown-content">
            <a href="#" onClick={onLogout}>Logout</a>
          </div>
        </div>
      </ProfileDropdown>
      <h2>Conversations</h2>
      <ul>
        {conversations.map(conv => (
          <li key={conv.id} onClick={() => onSelectConversation(conv.id)}>
            Conversation from {new Date(conv.created_at).toLocaleString()}
          </li>
        ))}
        <li onClick={onNewConversation}>New Conversation</li>
      </ul>
    </Sidebar>
  );
};

export default SidebarComponent;
