import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import logo from "../../public/assests/kloudlogo.webp";
import { Button, Collapse, Drawer, Radio, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { Menu } from "../Constants/Conts";
const { Panel } = Collapse;

const Navbar = () => {
  const { logout } = useAuthContext();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [placement, setPlacement] = useState("left");
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="bg-white shadow-md px-4 py-3">
      <nav className=" container mx-auto ">
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center sm:space-x-4 space-x-2 w-full max-w-xl">
            <button type="primary" onClick={showDrawer}>
              <i className="ri-menu-2-fill sm:text-3xl text-2xl rounded-full p-1"></i>
            </button>
            <NavLink to="/home">
              <img
                src={logo}
                alt="Logo"
                className="w-16 md:w-20 object-contain"
              />
            </NavLink>
            <input
              type="text"
              placeholder="Search"
              className="hidden md:flex md:w-full rounded-full px-4 py-2 bg-gray-100 focus:outline-none"
            />
          </div>
          {/* Right Side */}
          <div className="flex items-center space-x-3">
            <button
              onClick={logout}
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
        <Drawer
          title="Kloud Pharma Pharmacist"
          placement={placement}
          width={500}
          onClose={onClose}
          open={open}
          extra={
            <Space>
              <Button onClick={onClose}>Close Menu</Button>
            </Space>
          }
          bodyStyle={{ padding: 0 }}
          className="!p-0"
        >
          <Collapse accordion className="!not-sr-onlyp-0">
            {Object.entries(Menu).map(([key, actions]) => (
              <Panel
                header={
                  <div className="text-lg font-semibold text-highlight">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </div>
                }
                key={key}
                className="bg-white border-0 rounded-lg mb-2"
              >
                <ul>
                  {actions.map((el) => (
                    <li key={el.link} onClick={onClose}>
                      <NavLink to={el.link}>
                        <div className="card hover:bg-[#3FA9EE] hover:text-white text-base tracking-wide font-medium my-2.5">
                          {el.text}
                        </div>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </Panel>
            ))}
          </Collapse>
          <button
            onClick={logout}
            className="text-2xl  mx-6 text-red-600 font-medium"
          >
            LogOut <i className="ri-logout-box-r-line text-lg"></i>
          </button>
        </Drawer>
      </nav>
    </div>
  );
};

export default Navbar;
