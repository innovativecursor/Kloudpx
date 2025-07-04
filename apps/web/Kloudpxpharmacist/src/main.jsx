import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthProvider from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import PrescriptionProvider from "./contexts/PrescriptionContext";
import CartpresciProvider from "./contexts/CartpresciContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="573921060446-69ri70fkkm2ihruaqor1bugaeufbnsgj.apps.googleusercontent.com">
    <BrowserRouter>
      <AuthProvider>
        <PrescriptionProvider>
          <CartpresciProvider>
            <App />
          </CartpresciProvider>
        </PrescriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
