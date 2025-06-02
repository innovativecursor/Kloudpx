import { useState } from "react";
import "./PriceDropdown.css";
function PriceDropdown({ onPriceChange }) {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleFilter = () => {
    // Pass the selected price range to the parent component
    onPriceChange(minPrice, maxPrice);
  };

  return (
    <div className="price-tags-filter-option">
      <div className="price-ranges-in-price-bar">
        <span className="range-prices">
          <p>
            <label>
              <input className="with-gap" name="priceRange" type="radio" />
              <span>₹500 - ₹1,000</span>
            </label>
            <label>
              <input className="with-gap" name="priceRange" type="radio" />
              <span>₹10,000 - ₹15,000</span>
            </label>
            <label>
              <input className="with-gap" name="priceRange" type="radio" />
              <span>₹15,000 - ₹25,000</span>
            </label>
            <label>
              <input className="with-gap" name="priceRange" type="radio" />
              <span>Over ₹20,000</span>
            </label>
          </p>
        </span>
        {/* Add more price ranges here */}
      </div>
      <div className="price-inputs-price-dropdown">
        <div>
          <span className="price-rupee-filter">₹</span>
          <label htmlFor="minPrice" className="min-price-label">
            Min
          </label>
          <input
            type="number"
            id="minPrice"
            value={minPrice}
            className="price-dropdown-min-price"
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div>
          <span className="price-rupee-filter">₹</span>
          <label htmlFor="maxPrice" className="max-price-label">
            Max
          </label>
          <input
            type="number"
            id="maxPrice"
            value={maxPrice}
            className="price-dropdown-max-price"
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <div className="price-inputs-go-btn-price-dropdown">
          <button className="btn btn-primary" onClick={handleFilter}>
            Go
          </button>
        </div>
      </div>
    </div>
  );
}

export default PriceDropdown;
