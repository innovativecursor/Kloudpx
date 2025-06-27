import "./globals.css";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import { AppProvider } from "./contexts/AppContext";

export const metadata = {
  title: "Kloud Pharma",
  description: "Kloud Pharma Online Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </head>
      <body className={`antialiased min-h-screen flex flex-col`}>
        <AppProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
