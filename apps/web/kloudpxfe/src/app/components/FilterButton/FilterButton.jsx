import { useEffect, useState } from "react";
import M from "materialize-css";
import { FaFilter } from "react-icons/fa";
import shoes from "@/assets/shoes.png";
import colors from "@/assets/colour.png";
import tag from "@/assets/tag.png";
import Link from "next/link";
function FilterButton({ onClick }) {
  useEffect(() => {
    const elems = document.querySelectorAll(".fixed-action-btn");
    const instances = M.FloatingActionButton.init(elems, {
      hoverEnabled: false,
      direction: "buttom",
    });

    return () => {
      instances.forEach((instance) => instance.close());
    };
  }, []);

  const openBrandSidebar = () => {
    const elem = document.querySelector("#brandSidenav");

    const instance = M.Sidenav.getInstance(elem);
    instance.open();
    closeColorSidebar();
    closePriceRangeSidebar();
  };
  const openColorSidebar = () => {
    const elem = document.querySelector("#colorSidenav");
    const instance = M.Sidenav.getInstance(elem);
    instance.open();
    closeBrandSidebar();
    closePriceRangeSidebar();
  };
  const openPriceRangeSidebar = () => {
    const elem = document.querySelector("#priceRangeSidenav");
    const instance = M.Sidenav.getInstance(elem);
    instance.open();
    closeColorSidebar();
    closeBrandSidebar();
  };
  const closeBrandSidebar = () => {
    const elem = document.querySelector("#brandSidenav");
    const instance = M.Sidenav.getInstance(elem);
    instance.close();
  };

  const closeColorSidebar = () => {
    const elem = document.querySelector("#colorSidenav");
    const instance = M.Sidenav.getInstance(elem);
    instance.close();
  };

  const closePriceRangeSidebar = () => {
    const elem = document.querySelector("#priceRangeSidenav");
    const instance = M.Sidenav.getInstance(elem);
    instance.close();
  };

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleFilter = () => {
    console.log("Min Price:", minPrice);
    console.log("Max Price:", maxPrice);
  };

  const [selectedColors, setSelectedColors] = useState([]);

  // Function to handle color selection
  const handleColorSelection = (color) => {
    // If color is already selected, remove it from the list
    // Otherwise, add it to the list of selected colors
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  return (
    <>
      <div className="fixed-action-btn">
        <Link className="btn-floating btn-large red">
          <FaFilter />
        </Link>
        <ul>
          <li>
            <Link className="btn-floating red">
              <span
                className="material-symbols-outlined apparel-icon"
                onClick={openBrandSidebar}
              >
                apparel
              </span>
            </Link>
          </li>
          <li>
            <Link className="btn-floating red">
              <span
                className="material-symbols-outlined sell-filter-icon"
                onClick={openColorSidebar}
              >
                colors
              </span>
            </Link>
          </li>
          <li>
            <Link className="btn-floating red ">
              <span
                className="material-symbols-outlined sell-filter-icon"
                onClick={openPriceRangeSidebar}
              >
                sell
              </span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-fixed">
        <ul id="brandSidenav" className="sidenav">
          <div className="color-sidenav-filter">
            <li>
              <div className="brand-title">
                <span className="brand-main-title">Choose the Brands</span>
                <img
                  src={shoes}
                  style={{ height: "30px", margin: "5px" }}
                  alt=""
                />
              </div>

              <input
                type="text"
                className="search-bar-color"
                placeholder="Search Shoes brands"
              />
              <ul>
                <li>
                  <label>
                    <input type="checkbox" className="filled-in" />
                    <span>Adidas</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" className="filled-in" />
                    <span>Nike</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" className="filled-in" />
                    <span>Vans</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" className="filled-in" />
                    <span>Reebok</span>
                  </label>
                </li>
              </ul>
            </li>
          </div>
        </ul>
        <ul id="colorSidenav" className="sidenav">
          <div className="color-sidenav-filter">
            <li>
              <div className="colours-title">
                <span className="brand-main-title">Choose the colors</span>
                <img
                  src={colors}
                  style={{ height: "30px", margin: "5px" }}
                  alt=""
                />
              </div>
              <input
                className="search-bar-color"
                type="text"
                placeholder="Search colors"
              />
            </li>
            <li>
              <label>
                <input type="checkbox" className="filled-in" value="blue" />
                <span>All</span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" className="filled-in" value="blue" />
                <span>Red</span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" className="filled-in" value="blue" />
                <span>Blue</span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" className="filled-in" value="blue" />
                <span>Purple</span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" className="filled-in" value="blue" />
                <span>Green</span>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" className="filled-in" value="blue" />
                <span>Black</span>
              </label>
            </li>
          </div>
        </ul>
        <ul id="priceRangeSidenav" className="sidenav ">
          <div className="price-range-side-nav">
            <div className="price-tags-filter-option">
              <li className="price-range-text">Choose the Price ranges</li>
              <img src={tag} style={{ height: "30px", margin: "5px" }} alt="" />
            </div>
            <div className="price-ranges-in-price-bar">
              <span className="range-prices">
                <p>
                  <label>
                    <input
                      className="with-gap"
                      name="group3"
                      type="radio"
                      checked
                    />
                    <span>₹500 - ₹1,000</span>
                  </label>
                </p>
              </span>
              <span className="range-prices">
                <p>
                  <label>
                    <input
                      className="with-gap"
                      name="group3"
                      type="radio"
                      checked
                    />
                    <span>₹5,000 - ₹10,000</span>
                  </label>
                </p>
              </span>
              <span className="range-prices">
                <p>
                  <label>
                    <input
                      className="with-gap"
                      name="group3"
                      type="radio"
                      checked
                    />
                    <span>₹10,000 - ₹20,000</span>
                  </label>
                </p>
              </span>
              <span className="range-prices">
                <p>
                  <label>
                    <input
                      className="with-gap"
                      name="group3"
                      type="radio"
                      checked
                    />
                    <span>Over ₹20,000</span>
                  </label>
                </p>
              </span>
            </div>
            <div className="price-inputs">
              <div>
                <span className="price-rupee-filter">₹</span>
                <label htmlFor="minPrice" className="min-price-label">
                  Min
                </label>
                <input
                  type="number"
                  id="minPrice"
                  value={minPrice}
                  className="min-price-box"
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
                  className="max-price-box"
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <div className="price-inputs-go-btn">
                <button className="btn btn-primary" onClick={handleFilter}>
                  Go
                </button>
              </div>
            </div>
          </div>
        </ul>
      </div>
    </>
  );
}

export default FilterButton;
