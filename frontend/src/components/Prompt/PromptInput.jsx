import React, { useState } from "react";
import styled from "styled-components";

const InputContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #ffffff 20%);
  padding: 2rem 1.5rem;
  display: flex;
  justify-content: center;
  z-index: 10;
`;

const InputWrapper = styled.div`
  max-width: 800px;
  width: 100%;
  background: #ffffff;
  border: 1px solid #dadce0;
  border-radius: 24px;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;

  &:focus-within {
    border-color: #8e44ad;
    box-shadow: 0 4px 12px rgba(142, 68, 173, 0.15);
    transform: translateY(-1px);
  }
`;

const TextArea = styled.textarea`
  flex: 1;
  border: none;
  background: none;
  font-size: 1rem;
  line-height: 1.6;
  min-height: 24px;
  max-height: 200px;
  resize: none;
  padding: 0.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  color: #202124;
  letter-spacing: 0.2px;
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #5f6368;
    opacity: 0.8;
    transition: opacity 0.2s ease-in-out;
  }

  &:focus::placeholder {
    opacity: 0.5;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const SendButton = styled.button`
  background: ${(props) => (props.disabled ? "none" : "#8e44ad")};
  border: none;
  padding: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease-in-out;

  &:hover:not(:disabled) {
    background-color: #7d3c98;
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    cursor: not-allowed;
    background-color: transparent;
  }

  svg {
    width: 20px;
    height: 20px;
    fill: ${(props) => (props.disabled ? "#9aa0a6" : "#ffffff")};
    transition: fill 0.2s ease-in-out;
  }
`;

const SendIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const PromptInput = ({ onSendPrompt, isLoading, disabled }) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSendPrompt(prompt);
      setPrompt("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextAreaInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
    setPrompt(e.target.value);
  };

  return (
    <InputContainer>
      <InputWrapper>
        <TextArea
          value={prompt}
          onChange={handleTextAreaInput}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled ? "Connecting to server..." : "Message Gemini..."
          }
          disabled={isLoading || disabled}
          rows={1}
        />
        <SendButton
          onClick={handleSubmit}
          disabled={!prompt.trim() || isLoading || disabled}
          title="Send message"
          type="button"
        >
          <SendIcon />
        </SendButton>
      </InputWrapper>
    </InputContainer>
  );
};

export default PromptInput;
