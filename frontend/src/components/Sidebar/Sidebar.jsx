import React, { useState } from "react";
import styled from "styled-components";

const SidebarContainer = styled.div`
  width: 280px;
  height: 100vh;
  background: #f8f9fa;
  border-right: 1px solid #e5e5e5;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
`;

const NewChatButton = styled.button`
  background: #1a73e8;
  color: white;
  border: none;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background: #1557b0;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ConversationList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ConversationItem = styled.div`
  padding: 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  color: #202124;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  position: relative;

  ${(props) =>
    props.active &&
    `
    background: #e8f0fe;
    color: #1a73e8;
  `}

  &:hover {
    background: ${(props) => (props.active ? "#e8f0fe" : "#f1f3f4")};
  }

  .content {
    flex: 1;
    min-width: 0;
  }

  .title {
    font-weight: 500;
    margin-bottom: 0.2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .timestamp {
    font-size: 0.8rem;
    color: #5f6368;
    margin-bottom: 0.2rem;
  }

  .preview {
    color: #5f6368;
    font-size: 0.8rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  background: inherit;
  padding: 0.3rem;
  border-radius: 4px;

  ${ConversationItem}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0.3rem;
  cursor: pointer;
  color: #5f6368;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #202124;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const EditTitleInput = styled.input`
  width: 100%;
  padding: 0.3rem;
  border: 1px solid #1a73e8;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: inherit;
  margin: -0.3rem 0;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
  }
`;

const ClearAllButton = styled.button`
  background: none;
  border: none;
  padding: 0.8rem;
  color: #5f6368;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  border-radius: 8px;
  margin-top: auto;
  transition: all 0.2s;

  &:hover {
    background: #f1f3f4;
    color: #d93025;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Sidebar = ({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onClearConversations,
  onUpdateConversation,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const handleStartEdit = (conv) => {
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim()) {
      onUpdateConversation(editingId, { title: editTitle.trim() });
    }
    setEditingId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  return (
    <SidebarContainer>
      <NewChatButton onClick={onNewChat}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 5v14m-7-7h14" />
        </svg>
        New Chat
      </NewChatButton>
      <ConversationList>
        {conversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            active={conv.id === activeConversationId}
            onClick={() => onSelectConversation(conv.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="20"
              height="20"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <div className="content">
              {editingId === conv.id ? (
                <EditTitleInput
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleSaveEdit}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              ) : (
                <>
                  <div className="title">{conv.title}</div>
                  <div className="timestamp">
                    {new Date(conv.timestamp).toLocaleDateString()}{" "}
                    {new Date(conv.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="preview">{conv.preview}</div>
                </>
              )}
            </div>
            <ActionButtons>
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartEdit(conv);
                }}
                title="Rename conversation"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </ActionButton>
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conv.id);
                }}
                title="Delete conversation"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </ActionButton>
            </ActionButtons>
          </ConversationItem>
        ))}
      </ConversationList>
      {conversations.length > 0 && (
        <ClearAllButton
          onClick={onClearConversations}
          title="Clear all conversations"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          Clear All Conversations
        </ClearAllButton>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;
