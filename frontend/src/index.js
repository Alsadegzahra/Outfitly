import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * @fileoverview Entry point for rendering the Outfitly React application.
 * @module index
 */

/**
 * Root element where the React app is injected.
 * @constant {HTMLElement}
 */
const rootElement = document.getElementById('root');

/**
 * Creates a root for rendering the React application.
 * Uses `React.StrictMode` for highlighting potential problems in development mode.
 */
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
