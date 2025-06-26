import React from "react";
import { useLocation } from "react-router-dom";
import RoutePage from "./routes/RoutePage";
import { useAuthContext } from "./contexts/AuthContext";
import Navbar from "./Components/Navbar";

const App = () => {
  const location = useLocation();
  const { token } = useAuthContext();

  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && token && <Navbar />}
      <RoutePage />
    </>
  );
};

export default App;
