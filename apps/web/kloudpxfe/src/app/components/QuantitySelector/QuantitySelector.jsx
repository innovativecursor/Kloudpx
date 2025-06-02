import React, { useEffect, useState } from "react";
import M from "materialize-css";

function QuantitySelector({ onChange }) {
  const [selectedQuantity, setSelectedQuantity] = useState(""); // State to track selected quantity

  useEffect(() => {
    // Initialize Materialize select
    const selects = document.querySelectorAll("select");
    M.FormSelect.init(selects, {});

    // Update the input field value when selectedQuantity changes
    document.getElementById("quantity-input").value = selectedQuantity;
  }, [selectedQuantity]); // Re-run effect when selectedQuantity changes

  const handleQuantityChange = (event) => {
    const quantity = event.target.value;
    setSelectedQuantity(quantity); // Update selected quantity
    onChange(quantity); // Call the onChange callback
  };

  return (
    <div className="input-field">
      <select
        id="quantity-input"
        className="quantity-dropdown"
        value={selectedQuantity}
        onChange={handleQuantityChange}
      >
        <option value="" disabled>
          1
        </option>
        {[1, 2, 3, 4, 5, 6].map((quantity) => (
          <option key={quantity} value={quantity}>
            {quantity}
          </option>
        ))}
      </select>
      <label htmlFor="quantity-input" className="quantity-label">
        Select the Quantity
      </label>
    </div>
  );
}

export default QuantitySelector;
