import React from "react";
import ReactDOMClient from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import App from "./components/App"
 import { BrowserRouter } from "react-router-dom";
const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
reportWebVitals();
