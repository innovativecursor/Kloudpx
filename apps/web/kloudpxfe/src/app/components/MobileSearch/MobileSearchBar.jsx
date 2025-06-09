import { useEffect, useRef, useState } from "react";
import "./MobileSearchBar.css";
import image2 from "@/assets/image-2.jpg";
import image3 from "@/assets/image-3.jpg";
import SearchListItem from "@/app/components/SearchListItem/SearchListItem";
import SearchCard from "@/app/components/SearchCard/SearchCard";
const MobileSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const results = performSearch(searchQuery);
    setSearchResults(results);
    setShowDropdown(true);
  };

  const performSearch = (query) => {
    const mockSearchResults = [
      { id: 1, name: "Mobile Phone" },
      { id: 2, name: "Laptop" },
      { id: 3, name: "Tablet" },
    ];
    return mockSearchResults.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSelectProduct = (productName) => {
    setSearchQuery(productName);
    setShowDropdown(false);
    setSearchResults([]);
  };

  const handleRemoveItem = (item) => {
    console.log("Removing item:", item);
  };

  return (
    <div className="mobile_search">
      <form
        className="header_search_form"
        action="/search/"
        onSubmit={handleSearch}
      >
        <div className="header-search">
          <fieldset className="form-fieldset">
            <div className="input-group">
              <input
                className="browser-default form-input"
                data-search-quick=""
                name="search_query"
                placeholder="Search the store"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowDropdown(true)}
              />
              <div className="input-group-append">
                <button className="btn btn-secondary" type="submit">
                  <i className="material-symbols-outlined">search</i>
                </button>
              </div>
            </div>
          </fieldset>
        </div>
      </form>
      {showDropdown && (
        <div className="search-results">
          <ul>
            {searchResults.map((result) => (
              <li
                key={result.id}
                onClick={() => handleSelectProduct(result.name)}
              >
                {result.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div
        className={`dropdown-mobile ${
          searchResults.length === 0 && searchQuery.length > 0
            ? "active"
            : "inactive"
        }`}
      >
        <ul className="dropdown-menu-mobile">
          {searchResults.length === 0 && searchQuery.length > 0 && (
            <>
              <ul>
                <h5 className="header-search-KSF">Keep Shopping For</h5>
                <div className="search-card-images">
                  <div className="row">
                    <SearchCard image={image3} title="Apple Macbook" />
                    <SearchCard image={image2} title="Surface Shoes G" />
                    <SearchCard image={image3} title="Apple Macbook M2" />
                  </div>
                </div>
                <li className="search-list-items">
                  <SearchListItem item="Jeans" onRemove={handleRemoveItem} />
                  <SearchListItem
                    item="Google Pixel"
                    onRemove={handleRemoveItem}
                  />
                  <SearchListItem
                    item="MSI Laptops"
                    onRemove={handleRemoveItem}
                  />
                  <SearchListItem
                    item="Nvidia Titan V"
                    onRemove={handleRemoveItem}
                  />
                  <SearchListItem
                    item="Microsoft Surface"
                    onRemove={handleRemoveItem}
                  />
                  <SearchListItem
                    item="MacBook Air"
                    onRemove={handleRemoveItem}
                  />
                </li>
              </ul>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MobileSearchBar;
