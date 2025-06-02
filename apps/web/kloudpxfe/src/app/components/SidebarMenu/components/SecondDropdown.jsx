import { useState } from "react";
import PriceDropdown from "../../PriceDropdown/PriceDropdown";

function SecondDropdown({ options, category }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <ul className="navList-subMenu-item newList-nav">
      {category.title === "Price" ? (
        <PriceDropdown />
      ) : (
        options.map((option, index) => (
          <>
            <li key={index} onClick={() => handleItemClick(option)}>
              {category.title === "Brand" ? (
                <label>
                  <input
                    type="checkbox"
                    className="filled-in"
                    checked={selectedItem === option}
                    onChange={() => handleItemClick(option)}
                  />
                  <span>{option}</span>
                </label>
              ) : category.title === "Color" ? (
                <label>
                  <input
                    type="radio"
                    className="with-gap"
                    name="group3"
                    value={option}
                    checked={selectedItem === option}
                    onChange={() => handleItemClick(option)}
                  />
                  <span>{option}</span>
                </label>
              ) : null}
            </li>
          </>
        ))
      )}
    </ul>
  );
}

export default SecondDropdown;
