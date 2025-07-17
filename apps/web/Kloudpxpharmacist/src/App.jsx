import React from "react";
import { useLocation } from "react-router-dom";
import RoutePage from "./routes/RoutePage";
import { useAuthContext } from "./contexts/AuthContext";
import Navbar from "./Components/Navbar";
import GlobalLoader from "./loader/GlobalLoader";

const App = () => {
  const location = useLocation();
  const { isUserLoggedIn } = useAuthContext();

  const onLoginPage = location.pathname === "/login";

  return (
    <>
      <GlobalLoader />
      {isUserLoggedIn && !onLoginPage && <Navbar />}
      <RoutePage />
    </>
  );
};

export default App;
