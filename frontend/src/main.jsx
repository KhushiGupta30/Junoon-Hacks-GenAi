import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// This is the only createRoot call needed.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// The code below was a duplicate and has been removed.

const fontFamily = import.meta.env.VITE_FONT_FAMILY;

if (fontFamily) {
  // Dynamically load Google Font
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@400;500;700&display=swap`;
  document.head.appendChild(link);

  // Apply it as CSS variable
  document.documentElement.style.setProperty("--app-font", fontFamily);
}