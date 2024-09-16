import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import AlertState from "./context/alert/AlertState.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AlertState>
      <App />
    </AlertState>
  </React.StrictMode>
);
