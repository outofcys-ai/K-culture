import React from "react";
import ReactDOM from "react-dom/client";
import App from "./AppFinal";
import "./styles.css";
import "leaflet/dist/leaflet.css";

if ("serviceWorker" in navigator && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
