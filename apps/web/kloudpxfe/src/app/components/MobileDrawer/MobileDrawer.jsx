"use client";
import { useEffect, useState } from "react";
import M from "materialize-css"; // Import Materialize JS
import userImage from "@/assets/user-image-1.png";
import "./MobileDrawer.css";
import HelpSettingsSection from "../HelpSettingsSection/HelpSettingsSection";
import Link from "next/link";
const MobileDrawer = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems((prevOpenItems) => ({
      ...prevOpenItems,
      [id]: !prevOpenItems[id],
    }));
  };
  useEffect(() => {
    const sideNavElement = document.querySelector(".collapsible");
    M.Collapsible.init(sideNavElement, {});
  }, []);

  const menuItems = [
    {
      id: 1,
      title: "Mobiles & Tablets",
      subItems: [
        { id: 1, title: "All", link: "/browse" },
        { id: 2, title: "Submenu 1.1", link: "#" },
        { id: 3, title: "Submenu 1.2", link: "#" },
        { id: 3, title: "Submenu 1.3", link: "#" },
      ],
    },
    {
      id: 2,
      title: "Electronics",
      subItems: [],
    },
    {
      id: 3,
      title: "Appliances",
      subItems: [],
    },
    {
      id: 4,
      title: "Clothing & Fashion",
      subItems: [],
    },
    {
      id: 5,
      title: "Furniture",
      subItems: [
        { id: 4, title: "Similique", link: "#" },
        { id: 5, title: "Distinctio", link: "#" },
        { id: 6, title: "Porro", link: "#" },
        { id: 7, title: "Illum", link: "#" },
      ],
    },
    {
      id: 6,
      title: "Home Decor",
      subItems: [
        { id: 4, title: "All", link: "#" },
        { id: 5, title: "Quod", link: "#" },
        { id: 6, title: "Provident", link: "#" },
        { id: 7, title: "Cumque", link: "#" },
      ],
    },
  ];

  return (
    <ul id="slide-out" className="sidenav">
      <div className="">
        <li>
          <div className="user-view">
            <Link href="#user">
              <img className="circle" src={userImage} />
            </Link>
            <Link href="#name">
              <span className="name">Hello Vaishnav!</span>
            </Link>
            <Link href="#email">
              <span className="email">jdandturk@gmail.com</span>
            </Link>
          </div>
        </li>
      </div>
      <div className="menu_stack stack-menu">
        <div
          style={{ fontWeight: 800, fontSize: "20px" }}
          className="collapsible-header"
        >
          Shop by Department
        </div>
        <ul className="collapsible">
          {menuItems.map((menuItem) => (
            <li key={menuItem.id}>
              <div
                className="collapsible-header"
                onClick={() => toggleItem(menuItem.id)}
                style={{ fontSize: "13px", fontWeight: 500 }}
              >
                <span>{menuItem.title}</span>
                {menuItem.subItems.length > 0 && (
                  <div style={{ position: "absolute", right: 0 }}>
                    {openItems[menuItem.id] ? (
                      <i
                        style={{ fontSize: "20px" }}
                        className="material-icons"
                      >
                        expand_more
                      </i>
                    ) : (
                      <i
                        className="material-icons"
                        style={{ fontSize: "13px" }}
                      >
                        arrow_forward_ios
                      </i>
                    )}
                  </div>
                )}
              </div>
              <div
                className="collapsible-body"
                style={{ display: openItems[menuItem.id] ? "block" : "none" }}
              >
                <ul>
                  {menuItem.subItems.map((subItem) => (
                    <li key={subItem.id}>
                      <Link style={{ fontSize: "12px" }} href={subItem.link}>
                        {subItem.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
        <HelpSettingsSection />
      </div>
    </ul>
  );
};

export default MobileDrawer;
