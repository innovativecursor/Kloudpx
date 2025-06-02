/* eslint-disable react/prop-types */
import Link from "next/link";
import { useState } from "react";

function SideBarMenu2({ header, categories }) {
  return (
    <div className="sidebar-wrapper sidebar--categories">
      <h5 className="sidebarBlock-heading">{header}</h5>
      <div className="block-content clearfix">
        {categories.map((category) => (
          <Dropdown key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}

function Dropdown({ category }) {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <ul
        className="navList"
        onClick={toggleOpen}
        style={{
          cursor: "pointer",
          margin: "0px 0px",
          position: "relative",
        }}
      >
        <h6 className="title-department-sidemenu">{category.title}</h6>{" "}
        <span
          style={{
            position: "absolute",
            right: "10px",
            top: "32%",
            transform: "translateY(-50%)",
          }}
        >
          <i
            className={`material-icons ${open ? "rotate-180" : ""}`}
            style={{ fontSize: "20px" }}
          >
            expand_more
          </i>
        </span>
      </ul>

      {open && category.category.length > 0 && (
        <ul className="navList-action newList-subNav category-subNav">
          {category.category.map((item) => (
            <div className="navList-action" key={item.id}>
              <li className="navList-subMenu-item newList-nav side-bar-menu-2-title">
                <Link className="link-category-title" href={item.link}>
                  <span className="dot"></span> {item.title}
                </Link>
              </li>
            </div>
          ))}
        </ul>
      )}
    </>
  );
}

export default SideBarMenu2;
