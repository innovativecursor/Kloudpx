import { useState } from "react";

function QuantityInput() {
  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="quantity-input">
      <button className="quantity-btn" onClick={decreaseQuantity}>
        -
      </button>
      <input
        type="number"
        className="quantity quantity-input-number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />
      <button className="quantity-btn" onClick={increaseQuantity}>
        +
      </button>
    </div>
  );
}

export default QuantityInput;
