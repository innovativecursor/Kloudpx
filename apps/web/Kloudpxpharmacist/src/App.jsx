import React from "react";
import { useLocation } from "react-router-dom";
import RoutePage from "./routes/RoutePage";
import { useAuthContext } from "./contexts/AuthContext";
import Navbar from "./Components/Navbar";

const App = () => {
  const location = useLocation();
  const { isUserLoggedIn } = useAuthContext();

  const onLoginPage = location.pathname === "/login";

  return (
    <>
      {isUserLoggedIn && !onLoginPage && <Navbar />}
      <RoutePage />
    </>
  );
};

export default App;
