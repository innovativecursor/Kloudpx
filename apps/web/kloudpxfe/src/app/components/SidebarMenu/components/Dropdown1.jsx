/* eslint-disable react/prop-types */
import { useState } from "react";
import SecondDropdown from "../components/SecondDropdown";

function Dropdown1({ category }) {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems((prevOpenItems) => ({
      ...prevOpenItems,
      [id]: !prevOpenItems[id],
    }));
  };

  const brandOptions = ["Adidas", "Puma", "Vans", "Converse", "Jordan", "Nike"];
  const colorOptions = ["All", "Red", "Blue", "Green", "Purple", "Crimson"];
  const priceOptions = ["1,000", "5,000-10,000", "Over 20,000"];

  let options = [];

  if (category.title === "Brand") {
    options = brandOptions;
  } else if (category.title === "Color") {
    options = colorOptions;
  } else if (category.title === "Price") {
    options = priceOptions;
  }

  return (
    <>
      <ul className="navList">
        <span>{category.title}</span>
        <li className="navList-item">
          <div
            className="navList-action"
            onClick={() => toggleItem(category.id)}
            style={{
              fontSize: "15px",
              fontWeight: 500,
              marginBottom: "0px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "260px",
                top: "-20px",
              }}
            >
              <i style={{ fontSize: "20px" }} className="material-icons">
                expand_more
              </i>
            </div>
          </div>
        </li>
      </ul>
      {openItems[category.id] && (
        <SecondDropdown options={options} category={category} />
      )}
    </>
  );
}

export default Dropdown1;
