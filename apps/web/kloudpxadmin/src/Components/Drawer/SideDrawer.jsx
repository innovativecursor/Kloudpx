import React, { useState } from "react";
import { Button, Collapse, Drawer, Radio, Space } from "antd";
import { FaArrowRight } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { Menu } from "../../Constants/Conts";
import { googleLogout } from "@react-oauth/google";
const { Panel } = Collapse;

function SideDrawer() {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("left");
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <button
        type="primary"
        onClick={showDrawer}
        className="top-1/2 fixed rounded-lg text-6xl z-10"
      >
        <div className="rounded-full bg-homexbg border-spacing-8 p-2 ml-1">
          <FaArrowRight className="h-10 w-10 text-white" />
        </div>
      </button>
      <Drawer
        title="Kloud Pharma Portal"
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
          onClick={() => googleLogout()}
          className="text-2xl  mx-6 text-red-600 font-medium"
        >
          LogOut  <i className="ri-logout-box-r-line text-lg"></i>
        </button>
      </Drawer>
    </>
  );
}

export default SideDrawer;
