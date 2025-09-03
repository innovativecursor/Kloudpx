"use client";

import "./globals.css";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./contexts/AuthContext";
import { ProductProvider } from "./contexts/ProductContext";
import { CartProvider } from "./contexts/CartContext";
import { PrescriptionProvider } from "./contexts/PrescriptionContext";
import { ImageProvider } from "./contexts/ImagesContext";
import { Provider } from "react-redux";
import { store, persistor } from "@/app/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import Loader from "@/app/components/Loader/Loader";
import CustomToaster from "./utils/NoSSRToaster";
import { CheckoutProvider } from "./contexts/CheckoutContext";
import { PaymentProvider } from "./contexts/PaymentContext";
import ClientOnly from "./components/ClientOnly";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import { LoginAuthProvider } from "./contexts/LoginAuth";
import LoaderController from "./components/Loader/LoaderController";
import { ProfileProvider } from "./contexts/ProfileContext";
import { PwdProvider } from "./contexts/PwdContext";
import { SeniorCitizenProvider } from "./contexts/Seniorcitizen";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <ClientOnly>
          <ScrollToTop />
          <GoogleOAuthProvider clientId="573921060446-69ri70fkkm2ihruaqor1bugaeufbnsgj.apps.googleusercontent.com">
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <Loader />
                <LoaderController />
                <AuthProvider>
                  <LoginAuthProvider>
                    <ProfileProvider>
                      <PwdProvider>
                        <SeniorCitizenProvider>
                          <ProductProvider>
                            <CheckoutProvider>
                              <CartProvider>
                                <PrescriptionProvider>
                                  <PaymentProvider>
                                    <ImageProvider>
                                      <Header />
                                      <main className="flex-1">{children}</main>
                                      <Footer />
                                      <CustomToaster />
                                    </ImageProvider>
                                  </PaymentProvider>
                                </PrescriptionProvider>
                              </CartProvider>
                            </CheckoutProvider>
                          </ProductProvider>
                        </SeniorCitizenProvider>
                      </PwdProvider>
                    </ProfileProvider>
                  </LoginAuthProvider>
                </AuthProvider>
              </PersistGate>
            </Provider>
          </GoogleOAuthProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
