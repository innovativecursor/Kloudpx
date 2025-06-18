import React from "react";
import { connect } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Robots from "../Components/Robots/Robots";

function PrivateRoute(props) {
  let auth = props.isAuthenticated || !!localStorage.getItem("access_token");
  return auth ? <Outlet /> : <Navigate to="/" replace />;
}
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.universalReducer.isLoggedIn,
  };
};
export default connect(mapStateToProps)(PrivateRoute);
