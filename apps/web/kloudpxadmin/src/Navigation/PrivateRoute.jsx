// import React from "react";
// import { connect } from "react-redux";
// import { Navigate, Outlet } from "react-router-dom";
// import Robots from "../Components/Robots/Robots";

// function PrivateRoute(props) {
//   let auth = props.isAuthenticated || !!localStorage.getItem("access_token");
//   return auth ? <Outlet /> : <Navigate to="/" replace />;
// }
// const mapStateToProps = (state) => {
//   return {
//     isAuthenticated: state.universalReducer.isLoggedIn,
//   };
// };
// export default connect(mapStateToProps)(PrivateRoute);






import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

function PrivateRoute() {
  const { isAuthenticated, user } = useAuthContext();
  const localToken = localStorage.getItem("access_token");
  const isUserLoggedIn = isAuthenticated || !!localToken;

  useEffect(() => {
    if (!isUserLoggedIn) {
      console.warn("Unauthorized access blocked.");
    }
  }, [isUserLoggedIn]);

  return isUserLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
}

export default PrivateRoute;
