import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import logo from "../assets/kloudlogo.webp";
import { Button, Collapse, Drawer, Space, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { Menu } from "../Constants/Conts";
import { AiOutlineLogout } from "react-icons/ai";
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
          </div>
          {/* Right Side */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10">
              <img
                src="https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740"
                alt="profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <Tooltip title="Logout">
              <button
                onClick={logout}
                className="group relative inline-flex items-center justify-center md:w-9 md:h-9 w-8 h-8 rounded-full bg-white text-red-600 border border-red-300 hover:bg-gradient-to-tr from-red-500 to-red-700 hover:text-white transition-all duration-300 shadow-md"
              >
                <AiOutlineLogout className="text-xl transition-transform duration-300 group-hover:rotate-[-20deg]" />
              </button>
            </Tooltip>
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
          styles={{ body: { padding: 0 } }}
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
        </Drawer>
      </nav>
    </div>
  );
};

export default Navbar;
