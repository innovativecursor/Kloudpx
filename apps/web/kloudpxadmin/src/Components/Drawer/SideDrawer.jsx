import React, { useState } from "react";
import { Button, Collapse, Drawer, Radio, Space } from "antd";
import { FaArrowRight } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { Menu } from "../../Constants/Conts";
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
        title="Homex Builders Corp."
        placement={placement}
        width={500}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Close Menu</Button>
          </Space>
        }
        bodyStyle={{ padding: 0 }} // This removes padding in inline styles
        className="!p-0" // This removes padding using Tailwind's utility class with important
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
    </>
  );
}

export default SideDrawer;
