import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from 'react-router-dom';
import MobileApp from "./MobileApp.jsx";
import "./MobileApp.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <MobileApp />
    </Router>
  </React.StrictMode>
);
