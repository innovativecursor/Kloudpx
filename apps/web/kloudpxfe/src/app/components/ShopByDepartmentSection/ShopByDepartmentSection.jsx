import { useEffect, useState } from "react";
import M from "materialize-css";
import Link from "next/link";

const ShopByDepartmentSection = ({ menuItems, openItems, toggleItem }) => {
  useEffect(() => {
    const sideNavElement = document.querySelector(".collapsible");
    M.Collapsible.init(sideNavElement, {});
  }, []);

  return (
    <>
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
              {menuItem.subItems?.length > 0 && (
                <div style={{ position: "absolute", right: 0 }}>
                  {openItems[menuItem.id] ? (
                    <i style={{ fontSize: "20px" }} className="material-icons">
                      expand_more
                    </i>
                  ) : (
                    <i className="material-icons" style={{ fontSize: "13px" }}>
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
    </>
  );
};

export default ShopByDepartmentSection;
