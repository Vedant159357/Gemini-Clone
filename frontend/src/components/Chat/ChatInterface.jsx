import React, { useState, useEffect } from "react";
import { sendMessage, testConnection } from "../../services/api";
import styled from "styled-components";
import PromptInput from "../Prompt/PromptInput";
import ResponseDisplay from "../Response/ResponseDisplay";
import Sidebar from "../Sidebar/Sidebar";

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const ChatContainer = styled.div`
  flex: 1;
  margin-left: 280px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  background: #ffffff;
  padding: 1rem;
  border-bottom: 1px solid #e5e5e5;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #8e44ad 0%, #3498db 100%);
  border-radius: 50%;
`;

const Title = styled.h1`
  color: #202124;
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  color: #5f6368;
  margin: 4rem 0;
  font-size: 1.5rem;

  h2 {
    font-weight: 400;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.5;
  }
`;

const ChatInterface = () => {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem("conversations");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversationId) {
      const conversation = conversations.find(
        (c) => c.id === activeConversationId
      );
      if (conversation) {
        setMessages(conversation.messages || []);
      }
    } else {
      setMessages([]);
    }
  }, [activeConversationId]);

  useEffect(() => {
    const checkConnection = async () => {
      setIsConnecting(true);
      try {
        await testConnection();
        setIsConnecting(false);
      } catch (error) {
        console.error("Connection error:", error);
        setMessages([
          {
            type: "error",
            content:
              "Could not connect to the backend server. The server might be starting up, retrying in 2 seconds...",
          },
        ]);
        setTimeout(checkConnection, 2000);
      }
    };
    checkConnection();
  }, []);

  const handleNewChat = () => {
    const newConversation = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      title: "New Conversation",
      messages: [],
      preview: "Start a new conversation",
    };
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setMessages([]);
  };

  const handleSelectConversation = (conversationId) => {
    const selectedConversation = conversations.find(
      (c) => c.id === conversationId
    );
    if (selectedConversation) {
      setActiveConversationId(conversationId);
      setMessages(selectedConversation.messages || []);
    }
  };

  const handleDeleteConversation = (conversationId) => {
    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    if (activeConversationId === conversationId) {
      const remainingConversations = conversations.filter(
        (c) => c.id !== conversationId
      );
      if (remainingConversations.length > 0) {
        handleSelectConversation(remainingConversations[0].id);
      } else {
        setActiveConversationId(null);
        setMessages([]);
      }
    }
  };

  const handleClearConversations = () => {
    if (window.confirm("Are you sure you want to clear all conversations?")) {
      setConversations([]);
      setActiveConversationId(null);
      setMessages([]);
    }
  };

  const handleUpdateConversation = (conversationId, updates) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, ...updates } : conv
      )
    );
  };

  const updateConversation = (newMessages) => {
    if (!activeConversationId) return;

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversationId) {
          const lastMessage = newMessages[newMessages.length - 1];
          const firstMessage = newMessages[0];
          return {
            ...conv,
            messages: newMessages,
            preview: lastMessage
              ? lastMessage.content.substring(0, 50) + "..."
              : "",
            title:
              conv.title === "New Conversation" && firstMessage
                ? firstMessage.content.substring(0, 30) + "..."
                : conv.title,
          };
        }
        return conv;
      })
    );
  };

  const handleSendPrompt = async (prompt) => {
    if (!prompt.trim()) return;

    // Create new conversation if none is active
    if (!activeConversationId) {
      const newConversation = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        title: prompt.substring(0, 30) + "...",
        messages: [],
        preview: prompt.substring(0, 50) + "...",
      };
      setConversations((prev) => [newConversation, ...prev]);
      setActiveConversationId(newConversation.id);
    }

    const userMessage = { type: "user", content: prompt };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    updateConversation(newMessages);
    setIsLoading(true);

    try {
      const response = await sendMessage(prompt);
      console.log("Chat Response:", response);

      if (response) {
        const botResponse = {
          type: response.error ? "error" : "bot",
          content: response.response,
        };
        const updatedMessages = [...newMessages, botResponse];
        setMessages(updatedMessages);
        updateConversation(updatedMessages);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage = {
        type: "error",
        content: "An error occurred while processing your request.",
      };
      const updatedMessages = [...newMessages, errorMessage];
      setMessages(updatedMessages);
      updateConversation(updatedMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContainer>
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onClearConversations={handleClearConversations}
        onUpdateConversation={handleUpdateConversation}
      />
      <ChatContainer>
        <Header>
          <Logo>
            <LogoIcon />
            <Title>Gemini</Title>
          </Logo>
        </Header>
        <MainContent>
          {messages.length === 0 && !isConnecting && (
            <WelcomeMessage>
              <h2>Hello, how can I help you today?</h2>
              <p>
                I'm your AI assistant, ready to help with writing, analysis,
                answering questions, and more.
              </p>
            </WelcomeMessage>
          )}
          <ResponseDisplay messages={messages} isLoading={isLoading} />
        </MainContent>
        <PromptInput
          onSendPrompt={handleSendPrompt}
          isLoading={isLoading}
          disabled={isConnecting}
        />
      </ChatContainer>
    </AppContainer>
  );
};

export default ChatInterface;
