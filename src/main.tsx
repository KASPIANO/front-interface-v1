import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeModes } from './utils/Utils.ts';
import { AlertProvider } from './components/alert-context/AlertContext.tsx';
import { AlertContextType } from './types/Types.ts';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ThemeContext = React.createContext({ themeMode: ThemeModes.DARK, toggleThemeMode: () => {} });
export const AlertContext = createContext<AlertContextType | undefined>(undefined);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AlertProvider>
            <App />
        </AlertProvider>
    </React.StrictMode>,
);
