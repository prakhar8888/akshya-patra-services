import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import './styles/index.css';

/**
 * This is the main entry point for the React application.
 *
 * We wrap the entire application in three key components:
 * 1. StrictMode: A tool for highlighting potential problems in an application.
 * 2. BrowserRouter: Enables client-side routing for the entire app.
 * 3. AuthProvider: Makes the global authentication state (user, login/logout functions)
 * available to every component, which is the heart of our session management.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
