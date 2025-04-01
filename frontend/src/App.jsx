import React from "react";
import { createGlobalStyle } from "styled-components";
import ChatInterface from "./components/Chat/ChatInterface";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: "Google Sans", -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #ffffff;
    color: #202124;
    line-height: 1.6;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: #dadce0;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #bdc1c6;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <ChatInterface />
    </>
  );
}

export default App;
