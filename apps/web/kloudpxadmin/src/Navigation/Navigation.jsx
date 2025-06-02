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
import SideDrawer from "../Components/Drawer/SideDrawer";
import { matchRoutes, useLocation } from "react-router-dom";
import Navbar from "../Components/NavigationBar/Navbar";
import ProductTable from "../Components/ProductTable/ProductTable";
import Robots from "../Components/Robots/Robots";
import Inquiries from "../Components/Inquiries/Inquiries";
import ResetPassword from "../Components/resetPassword/ResetPassword";
import CreateProjects from "../Components/createProject/CreateProjects";
import Updateprojects from "../Components/updateProject/UpdateProject";
import DeleteProjects from "../Components/deleteProjects/DeleteProjects";
import About from "../Components/about/About";
import CreateService from "../Components/createService/CreateService";
import UpdateService from "../Components/updateService/UpdateService";
import DeleteService from "../Components/deleteService/DeleteService";
import Achievements from "../Components/achievements/Achievements";
import CreateTestimonials from "../Components/testimonials/CreateTestimonials";
import UpdateTestimonial from "../Components/updateTestimonial/UpdateTestimonial";
import DeleteTestimonials from "../Components/DeleteTestimonials/DeleteTestimonials";
import UpdateStaff from "../Components/UpdateStaff/UpdateStaff";
import AddStaff from "../Components/AddStaff/AddStaff";
import DeleteStaff from "../Components/DeleteStaff/DeleteStaff";
import CreateUsers from "../Components/createUsers/CreateUsers";

function Navigation(props) {
  const location = useLocation();
  const navigateTo = useNavigate();
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
        {location.pathname !== "/" && props.loggedIn ? (
          <div className="">
            <Navbar />
            <SideDrawer />
          </div>
        ) : (
          ""
        )}

        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/reset/:token" element={<ResetPassword />} />
            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/inquiries" element={<Inquiries />} />
              <Route path="/createProjects" element={<CreateProjects />} />
              <Route
                path="/updateProjects"
                element={<ProductTable pageMode="Update" type="Projects" />}
              />
              <Route path="/updateProjectsinner" element={<Updateprojects />} />
              <Route
                path="/deleteProjects"
                element={<ProductTable pageMode="Delete" type="Projects" />}
              />
              <Route path="/deleteProjectsinner" element={<DeleteProjects />} />

              <Route path="/about" element={<About />} />
              <Route path="/createServices" element={<CreateService />} />
              <Route
                path="/updateServices"
                element={<ProductTable pageMode="Update" type="Services" />}
              />
              <Route path="/updateServicesinner" element={<UpdateService />} />
              <Route
                path="/deleteServices"
                element={<ProductTable pageMode="Delete" type="Services" />}
              />
              <Route path="/deleteServicesinner" element={<DeleteService />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route
                path="/createTestimonial"
                element={<CreateTestimonials />}
              />
              <Route
                path="/updateTestimonial"
                element={<ProductTable pageMode="Update" type="Testimonials" />}
              />
              <Route
                path="/updateTestimonialinner"
                element={<UpdateTestimonial />}
              />
              <Route
                path="/deleteTestimonial"
                element={<ProductTable pageMode="Delete" type="Testimonials" />}
              />
              <Route
                path="/deleteTestimonialinner"
                element={<DeleteTestimonials />}
              />
              <Route path="/createStaff" element={<AddStaff />} />
              <Route
                path="/updateStaff"
                element={<ProductTable pageMode="Update" type="Staff" />}
              />
              <Route path="/updateStaffinner" element={<UpdateStaff />} />
              <Route
                path="/deleteStaff"
                element={<ProductTable pageMode="Delete" type="Staff" />}
              />
              <Route path="/deleteStaffinner" element={<DeleteStaff />} />
              {props?.userDetails?.role_id > 4 && (
                <Route path="/createUsers" element={<CreateUsers />} />
              )}
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
