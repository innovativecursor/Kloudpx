/* eslint-disable no-undef */
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store, persistor } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthProvider from "./contexts/AuthContext.jsx";
import ImageProvider from "./contexts/ImageContext.jsx";
import DropdownProvider from "./contexts/DropdownContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="573921060446-69ri70fkkm2ihruaqor1bugaeufbnsgj.apps.googleusercontent.com">
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <AuthProvider>
            <ImageProvider>
              <DropdownProvider>
                <App />
              </DropdownProvider>
            </ImageProvider>
          </AuthProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </GoogleOAuthProvider>
);
