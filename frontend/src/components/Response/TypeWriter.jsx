import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Container = styled.div`
  opacity: 0;
  animation: ${fadeIn} 0.3s ease forwards;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: #1a73e8;
  margin-left: 2px;
  animation: blink 1s infinite;

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
`;

const TypeWriter = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!text) {
      setDisplayText("");
      return;
    }

    let currentText = "";
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        currentText += text[currentIndex];
        setDisplayText(currentText);
        currentIndex++;
      } else {
        clearInterval(interval);
        setShowCursor(false);
      }
    }, 20); // Type faster

    return () => {
      clearInterval(interval);
      setShowCursor(true);
    };
  }, [text]);

  if (!text) {
    return null;
  }

  return (
    <Container>
      <span dangerouslySetInnerHTML={{ __html: displayText }} />
      {showCursor && <Cursor />}
    </Container>
  );
};

export default TypeWriter;
