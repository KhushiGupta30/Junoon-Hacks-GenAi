import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const fontFamily = import.meta.env.VITE_FONT_FAMILY;

if (fontFamily) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https:
    " ",
    "+"
  )}:wght@400;500;700&display=swap`;
  document.head.appendChild(link);

  document.documentElement.style.setProperty("--app-font", fontFamily);
}
