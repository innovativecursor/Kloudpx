// "use client";

// import "./globals.css";
// import Footer from "./components/Footer/Footer";
// import Header from "./components/Header/Header";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import { AuthProvider } from "./contexts/AuthContext";
// import { ProductProvider } from "./contexts/ProductContext";
// import { CartProvider } from "./contexts/CartContext";
// import { Toaster } from "react-hot-toast";
// import DashboardLoading from "./components/Loader/DashboardLoader";
// import { useAuth } from "./contexts/AuthContext";

// // export const metadata = {
// //   title: "Kloud Pharma",
// //   description: "Kloud Pharma Online Store",
// // };

// function InnerApp({ children }) {
//   const { loading } = useAuth();

//   if (loading) return <DashboardLoading />;

//   return children;
// }

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <head>
//         <link
//           href="https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css"
//           rel="stylesheet"
//         />
//       </head>
//       <body className="antialiased min-h-screen flex flex-col">
//         <GoogleOAuthProvider clientId="573921060446-69ri70fkkm2ihruaqor1bugaeufbnsgj.apps.googleusercontent.com">
//           <AuthProvider>
//             <ProductProvider>
//               <CartProvider>
//                 <Header />
//                 <main className="flex-1">
//                   <InnerApp>{children}</InnerApp>
//                 </main>
//                 <Footer />
//                 <Toaster position="top-right" reverseOrder={false} />
//               </CartProvider>
//             </ProductProvider>
//           </AuthProvider>
//         </GoogleOAuthProvider>
//       </body>
//     </html>
//   );
// }

"use client";

import "./globals.css";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./contexts/AuthContext";
import { ProductProvider } from "./contexts/ProductContext";
import { CartProvider } from "./contexts/CartContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import GlobalLoaderHandler from "./components/Loader/GlobalLoaderHandler";
import { Toaster } from "react-hot-toast";

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
        <GoogleOAuthProvider clientId="573921060446-69ri70fkkm2ihruaqor1bugaeufbnsgj.apps.googleusercontent.com">
          <LoadingProvider>
            <GlobalLoaderHandler />
            <AuthProvider>
              <ProductProvider>
                <CartProvider>
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <Toaster position="top-right" reverseOrder={false} />
                </CartProvider>
              </ProductProvider>
            </AuthProvider>
          </LoadingProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
