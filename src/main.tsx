import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Register as a custom element for Liferay Client Extension
class LiferayAdminDashboard extends HTMLElement {
  connectedCallback() {
    // Render React app into this element
    const root = ReactDOM.createRoot(this);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}

// Register the custom element
if (!customElements.get('liferay-admin-dashboard')) {
  customElements.define('liferay-admin-dashboard', LiferayAdminDashboard);
}

// Also render to #root for standalone development
const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
