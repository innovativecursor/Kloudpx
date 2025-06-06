/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import logo from "../../../public/kloudlogo.webp";
import { googleLogout } from "@react-oauth/google";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-white shadow-md px-4 py-3">
      <nav className=" container mx-auto ">
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center space-x-4 w-full max-w-md">
            <NavLink to="/">
              <img
                src={logo}
                alt="Logo"
                className="w-16 md:w-20 object-contain"
              />
            </NavLink>
            <input
              type="text"
              placeholder="Search"
              className="w-52 md:w-full rounded-full px-4 py-2 bg-gray-100 focus:outline-none"
            />
          </div>

          {/* Hamburger for Mobile */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => googleLogout()}
              className=" text-lg text-red-600 font-medium"
            >
              <i className="ri-logout-box-r-line font-semibold text-xl"></i>
            </button>
            <div className="relative">
              <i className="ri-notification-3-line text-2xl text-gray-600"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                2
              </span>
            </div>

            <div className="w-10 h-10">
              <img
                src="https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740"
                alt="profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>

          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 space-y-2 text-center">
            <NavLink to="/home" className="block text-lg text-gray-700">
          <i className="ri-home-4-line"></i>
            </NavLink>
            <button
              onClick={() => googleLogout()}
              className=" text-lg text-red-600 font-medium"
            >
              <i className="ri-logout-box-r-line"></i>
            </button>
          </div>
        )}
      </nav>
    </div>
  );
}

const mapStateToProps = (state) => ({
  userDetails: state.universalReducer,
});

export default connect(mapStateToProps)(Navbar);
