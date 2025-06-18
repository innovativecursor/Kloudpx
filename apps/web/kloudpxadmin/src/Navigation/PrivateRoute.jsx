import React from "react";
import { connect } from "react-redux";
import { Outlet } from "react-router-dom";
import Robots from "../Components/Robots/Robots";

function PrivateRoute(props) {
  const auth = props.isAuthenticated || !!localStorage.getItem("access_token");
  return auth ? <Outlet /> : <Robots />;
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.universalReducer.isLoggedIn,
});

export default connect(mapStateToProps)(PrivateRoute);
