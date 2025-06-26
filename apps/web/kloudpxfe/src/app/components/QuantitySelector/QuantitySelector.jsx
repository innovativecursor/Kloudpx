// import React, { useEffect, useState } from "react";
// import M from "materialize-css";

// function QuantitySelector({ onChange }) {
//   const [selectedQuantity, setSelectedQuantity] = useState(""); // State to track selected quantity

//   useEffect(() => {
//     // Initialize Materialize select
//     const selects = document.querySelectorAll("select");
//     M.FormSelect.init(selects, {});

//     // Update the input field value when selectedQuantity changes
//     document.getElementById("quantity-input").value = selectedQuantity;
//   }, [selectedQuantity]); // Re-run effect when selectedQuantity changes

//   const handleQuantityChange = (event) => {
//     const quantity = event.target.value;
//     setSelectedQuantity(quantity); // Update selected quantity
//     onChange(quantity); // Call the onChange callback
//   };

//   return (
//     <div className="input-field">
//       <select
//         id="quantity-input"
//         className="quantity-dropdown"
//         value={selectedQuantity}
//         onChange={handleQuantityChange}
//       >
//         <option value="" disabled>
//           1
//         </option>
//         {[1, 2, 3, 4, 5, 6].map((quantity) => (
//           <option key={quantity} value={quantity}>
//             {quantity}
//           </option>
//         ))}
//       </select>
//       <label htmlFor="quantity-input" className="quantity-label">
//         Select the Quantity
//       </label>
//     </div>
//   );
// }

// export default QuantitySelector;

"use client";
import React, { useState } from "react";

const QuantitySelector = () => {
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="mt-4 flex items-center gap-4">
      <button
        onClick={decrease}
        className="w-8 h-8 rounded-full bg-gray-200 text-lg font-bold hover:bg-gray-300"
      >
        -
      </button>
      <span className="text-lg font-medium w-6 text-center">{quantity}</span>
      <button
        onClick={increase}
        className="w-8 h-8 rounded-full bg-gray-200 text-lg font-bold hover:bg-gray-300"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
