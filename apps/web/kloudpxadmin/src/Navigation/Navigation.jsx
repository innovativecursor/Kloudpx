import React, { useEffect } from "react";
import Login from "../Components/Login/Login";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
} from "react-router-dom";
import Home from "../Components/Home/Home";
import { connect } from "react-redux";
import PrivateRoute from "./PrivateRoute";
import { useLocation } from "react-router-dom";
import Navbar from "../Components/NavigationBar/Navbar";
import Robots from "../Components/Robots/Robots";
import AddMedicine from "../Components/addMedicine/AddMedicine";
import OrderHistory from "../Components/Invoices/OrderHistory";
import AllMedicine from "../Components/addMedicine/AllMedicine";
import AddSupplier from "../Components/supplier/AddSupplier";
import UpdateMedicine from "../Components/addMedicine/UpdateMedicine";
import { useAuthContext } from "../contexts/AuthContext";
import Carousel from "../Components/carousel/Carousel";
import Gallery from "../Components/gallery/Gallery";
import AllOrders from "../pages/AllOrders";
import OrderDetails from "../pages/OrderDetails";
import AddThreshold from "../Components/threshold/AddThreshold";
import AllThreshold from "../Components/threshold/AllThreshold";
import Allpwd from "../pages/Allpwd";
import ScId from "../pages/ScId";
import Prescription from "../pages/Prescription";
import PrescriptionDetails from "../pages/PrescriptionDetails";

function Navigation(props) {
  const location = useLocation();
  const navigateTo = useNavigate();
  const { isAuthenticated } = useAuthContext();
  useEffect(() => {
    if (location.pathname === "/") {
      window.localStorage.clear();
      localStorage.removeItem("access_token");
      navigateTo("/");
      props.loggedOut();
    }
  }, [location.pathname]);

  return (
    <>
      <div>
        {location.pathname !== "/" && isAuthenticated ? (
          <div className="">
            <Navbar />
          </div>
        ) : (
          ""
        )}
        <div>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route element={<PrivateRoute />}>
              <Route>
                <Route path="/home" element={<Home />} />
                <Route path="/addMedicine" element={<AddMedicine />} />
                <Route path="/carousel" element={<Carousel />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/allorders" element={<AllOrders />} />
                <Route path="/updatethreshold" element={<AddThreshold />} />
                <Route path="/allthreshold" element={<AllThreshold />} />
                <Route path="/ordersdetails/:id" element={<OrderDetails />} />
                <Route path="/edit-medicine" element={<AddMedicine />} />
                <Route path="/orderHistory" element={<OrderHistory />} />
                <Route path="/allmedicine" element={<AllMedicine />} />
                <Route path="/allpwd" element={<Allpwd />} />
                <Route path="/seniorcitizenid" element={<ScId />} />
                <Route path="/prescription" element={<Prescription />} />
                <Route path="/prescriptiondetails/:id" element={<PrescriptionDetails />} />
                <Route path="/addsupplier" element={<AddSupplier />} />
                <Route path="/edit-medicine/:id" element={<UpdateMedicine />} />
              </Route>
            </Route>
            <Route path="*" element={<Robots />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    loggedOut: () => dispatch({ type: "LOGGEDOUT" }),
  };
};
const mapStateToProps = (state) => {
  return {
    loggedIn: state?.universalReducer?.isLoggedIn,
    userDetails: state.universalReducer,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
