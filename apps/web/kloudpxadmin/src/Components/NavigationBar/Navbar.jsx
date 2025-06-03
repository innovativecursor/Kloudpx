import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import logo from "../../../public/kloudlogo.webp";
function Navbar(props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const logOut = async () => {
    window.localStorage.clear();
    localStorage.removeItem("access_token");
    navigateTo("/");
    props.loggedOut();
  };
  return (
    <nav className=" bg-homexbg bg-opacity-10 p-2 shadow-xl">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo or Brand Name */}
          <div className="">
            <NavLink href="/" className=" text-3xl font-serif ">
              <img
                src={logo}
                className="h-fit"
                alt="logo"
                loading="eager"
                priority={true}
                style={{
                  height: "50%",
                  width: "50%",
                  verticalAlign: "middle",
                  // transform: "scale(6.5)",
                }}
              />
            </NavLink>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-highlight">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}

          <ul className="hidden md:flex space-x-8 text-xl justify-center items-center text-highlight font-medium">
            {/* <div className="">
              <p className="font-semibold">
                Hi, {props.userDetails?.firstName} {props.userDetails?.lastName}
              </p>
            </div> */}
            <li>
              <NavLink to="/home" className="">
                Home
              </NavLink>
            </li>

            <li>
              <NavLink to="/" className="" onClick={logOut}>
                Logout
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Mobile Menu (Hidden by Default) */}
        <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
          <ul className="mt-2 space-y-2 text-center text-xl">
            <li>
              <NavLink to="/home" className="text-highlight">
                Home
              </NavLink>
            </li>

            <li>
              <NavLink to="/" className="text-highlight">
                Logout
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
const mapStateToProps = (state) => {
  return {
    userDetails: state.universalReducer,
  };
};
export default connect(mapStateToProps)(Navbar);
