import React, { useState } from 'react';
import { Sidebar, ProfileSection, ProfileDropdown, ConversationList, ConversationItem, DropdownContent, ShowDropdown } from './styles';

const SidebarComponent = ({ conversations, onSelectConversation, onNewConversation, onLogout, onRenameConversation, onDeleteConversation }) => {
  const [showDropdown, setShowDropdown] = useState(null);

  const handleRename = (id) => {
    const newName = prompt('Enter new conversation name:');
    if (newName) {
      onRenameConversation(id, newName);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      onDeleteConversation(id);
    }
  };

  const toggleDropdown = (id) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  return (
    <Sidebar>
      <ProfileSection>
        <ProfileDropdown>
          <div className="dropdown">
            <span>Profile</span>
            <div className="dropdown-content">
              <a href="#" onClick={onLogout}>Logout</a>
            </div>
          </div>
        </ProfileDropdown>
        <h2>Conversations</h2>
      </ProfileSection>
      <ConversationList>
        {conversations.map(conv => (
          <ConversationItem key={conv.id}>
            <span onClick={() => onSelectConversation(conv.id)}>
              {conv.name || `Conversation from ${new Date(conv.created_at).toLocaleString()}`}
            </span>
            <div className="dropdown">
              <button onClick={() => toggleDropdown(conv.id)}>⋮</button>
              {showDropdown === conv.id && (
                <ShowDropdown>
                  <a href="#" onClick={() => handleRename(conv.id)}>Rename</a>
                  <a href="#" onClick={() => handleDelete(conv.id)}>Delete</a>
                </ShowDropdown>
              )}
            </div>
          </ConversationItem>
        ))}
        <li onClick={onNewConversation}>New Conversation</li>
      </ConversationList>
    </Sidebar>
  );
};

export default SidebarComponent;
