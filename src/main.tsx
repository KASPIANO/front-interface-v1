import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeModes } from './utils/Utils.ts';

const queryClient = new QueryClient();
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ThemeContext = React.createContext({ themeMode: ThemeModes.DARK, toggleThemeMode: () => {} });

const container = document.getElementById('root');
if (!container) {
    throw new Error('Root container missing in index.html');
}

// Use a singleton pattern to ensure createRoot is called only once
let root;
if (!(container as any).__root) {
    root = ReactDOM.createRoot(container);
    (container as any).__root = root;
} else {
    root = (container as any).__root;
}

// Render the App component
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </React.StrictMode>,
);
