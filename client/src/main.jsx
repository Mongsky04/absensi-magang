// =========================
// REACT DOM RENDERER
// =========================
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// =========================
// GLOBAL STYLES
// =========================
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    {/* =========================
        ROOT APP
    ========================= */}
    <App />

  </React.StrictMode>
);
