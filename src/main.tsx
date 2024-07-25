import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeModes } from './utils/Utils.ts';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ThemeContext = React.createContext({ themeMode: ThemeModes.DARK, toggleThemeMode: () => {} });
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
