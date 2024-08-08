import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  #scrollableList {
    scrollbar-width: thin;
    scrollbar-color: #888 #111;

    &::-webkit-scrollbar {
      width: 12px;
    }

    &::-webkit-scrollbar-track {
      background: #111;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #888;
      border-radius: 10px;
      border: 2px solid #111;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  }
`;
export const GlobalStyleDialog = createGlobalStyle`
  .MuiPaper-root {
    scrollbar-width: thin;
    scrollbar-color: #888 #111;

    &::-webkit-scrollbar {
      width: 12px;
    }

    &::-webkit-scrollbar-track {
      background: #111;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #888;
      border-radius: 10px;
      border: 2px solid #111;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  }
`;
