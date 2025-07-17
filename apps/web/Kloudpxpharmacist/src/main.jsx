import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthProvider from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import PrescriptionProvider from "./contexts/PrescriptionContext";

import { store } from "./store/index";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="573921060446-69ri70fkkm2ihruaqor1bugaeufbnsgj.apps.googleusercontent.com">
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <PrescriptionProvider>
            <App />
          </PrescriptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </GoogleOAuthProvider>
);
