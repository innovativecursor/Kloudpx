import M from "materialize-css";
import { useEffect } from "react";

const Collapsible = ({ collapsibleItems }) => {
  useEffect(() => {
    // Initialize collapsible on component mount
    const collapsibles = document.querySelectorAll(".collapsible");
    M.Collapsible.init(collapsibles, {});
  }, []);

  return (
    <ul className="collapsible no-shadow">
      {collapsibleItems.map((item, index) => (
        <li key={index}>
          <div className="collapsible-header" tabIndex="0">
            <i
              className={`material-symbols-outlined ${
                item.active ? "active-icon" : ""
              }`}
            >
              {item.icon}
            </i>
            {item.title}
            <div style={{ position: "absolute", right: 30 }}>
              <i className="material-icons">expand_more</i>
            </div>
          </div>
          <div className="collapsible-body">{item.content}</div>
        </li>
      ))}
    </ul>
  );
};

export default Collapsible;
