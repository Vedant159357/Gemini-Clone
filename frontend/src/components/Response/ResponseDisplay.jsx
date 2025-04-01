import React from "react";
import styled from "styled-components";
import TypeWriter from "./TypeWriter";

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 100px; // Space for input
`;

const MessageWrapper = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: ${(props) => (props.type === "user" ? "#f8f9fa" : "#ffffff")};
  border: 1px solid #e5e5e5;
  box-shadow: ${(props) =>
    props.type === "user" ? "none" : "0 2px 6px rgba(0, 0, 0, 0.05)"};
  max-width: 100%;
  overflow-x: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${(props) =>
      props.type === "user" ? "none" : "0 4px 12px rgba(0, 0, 0, 0.1)"};
  }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: white;
  font-size: 16px;
  background: ${(props) =>
    props.type === "user"
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : props.type === "error"
      ? "linear-gradient(135deg, #ff4b4b 0%, #ff416c 100%)"
      : "linear-gradient(135deg, #00b09b 0%, #96c93d 100%)"};
`;

const MessageContent = styled.div`
  flex: 1;
  overflow-x: auto;
  color: ${(props) => (props.type === "error" ? "#d93025" : "#202124")};
  font-size: ${(props) => (props.type === "error" ? "0.95rem" : "1rem")};
  line-height: 1.6;
  font-family: "Google Sans", sans-serif;

  pre {
    margin: 1rem 0;
    padding: 1rem;
    background: #f6f8fa;
    border-radius: 8px;
    overflow-x: auto;
    font-family: "Roboto Mono", monospace;
    font-size: 0.9em;
  }

  p {
    margin-bottom: 0.75rem;
    &:last-child {
      margin-bottom: 0;
    }
  }

  ul,
  ol {
    margin: 0.75rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin: 0.5rem 0;
  }

  code {
    background: #f6f8fa;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: "Roboto Mono", monospace;
    font-size: 0.9em;
  }

  strong {
    color: #202124;
    font-weight: 500;
  }

  a {
    color: #1a73e8;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ResponseDisplay = ({ messages, isLoading }) => {
  return (
    <MessagesContainer>
      {messages.map((message, index) => (
        <MessageWrapper key={index} type={message.type}>
          <Avatar type={message.type}>
            {message.type === "user" ? "U" : message.type === "bot" ? "G" : "!"}
          </Avatar>
          <MessageContent type={message.type}>
            {message.type === "bot" &&
            index === messages.length - 1 &&
            isLoading ? (
              <TypeWriter text={message.content} />
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: formatMessage(message.content),
                }}
              />
            )}
          </MessageContent>
        </MessageWrapper>
      ))}
    </MessagesContainer>
  );
};

// Helper function to format message content with markdown-like syntax
const formatMessage = (content) => {
  if (!content) return "";

  return (
    content
      // Style code blocks
      .replace(
        /`([^`]+)`/g,
        "<code style=\"background: #f6f8fa; padding: 0.2em 0.4em; border-radius: 3px; font-family: 'Roboto Mono', monospace; font-size: 0.9em;\">$1</code>"
      )
      // Style bold text
      .replace(
        /\*\*([^*]+)\*\*/g,
        '<strong style="color: #202124; font-weight: 500;">$1</strong>'
      )
      // Style links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" style="color: #1a73e8; text-decoration: none;">$1</a>'
      )
      // Convert newlines to <br>
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("<br>")
  );
};

export default ResponseDisplay;
