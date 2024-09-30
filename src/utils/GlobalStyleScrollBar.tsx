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
export const GlobalStyleAutoComplete = createGlobalStyle`
  .MuiAutoComplete-root {
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

export const GlobalStyleTokenSideBar = createGlobalStyle`
  .MuiTabPanel-root  {
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

export const DateStyle = createGlobalStyle`
    input[type="date"]::-webkit-calendar-picker-indicator {
    color: red;
    font-size: 1rem; /* Control the icon size */
    opacity: 1; /* Ensure the icon is visible */
    width: 15px;
    margin-top: 4px; /* Adjust positioning if necessary */
}
`;
