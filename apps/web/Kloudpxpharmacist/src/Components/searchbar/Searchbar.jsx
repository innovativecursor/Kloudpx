import React, { useState, useEffect, useRef } from "react";
import { usePrescriptionContext } from "../../contexts/PrescriptionContext";
import { useCartpresciContext } from "../../contexts/CartpresciContext";

const Searchbar = () => {
  const [input, setInput] = useState("");
  const { searchMedicine, searchResults, searchLoading } =
    usePrescriptionContext();
  const { setSelectedMedicineId } = useCartpresciContext();
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (input.trim() !== "") {
      searchMedicine(input);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [input]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-lg" ref={wrapperRef}>
      <div className="flex items-center bg-white border rounded-full overflow-hidden shadow-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search for medicines..."
          className="w-full px-4 py-2 text-sm focus:outline-none"
        />
        <button className="bg-[#006EBB] px-4 py-2 text-white">
          <i className="ri-search-line text-lg"></i>
        </button>
      </div>

      {showResults && (
        <div className="absolute z-50 w-full mt-1 bg-white border font-medium rounded-md shadow-lg max-h-60 overflow-y-auto">
          {searchLoading ? (
            <p className="p-3 text-sm text-gray-900">Loading...</p>
          ) : searchResults && searchResults?.length ? (
            searchResults.map((item, idx) => (
              <div
                key={idx}
                className="p-3 hover:bg-blue-100 text-sm text-gray-800 cursor-pointer"
                onClick={() => {
                  setInput(item.BrandName);
                  setShowResults(false);
                  setSelectedMedicineId(item.ID);
                }}
              >
                {item.BrandName}
              </div>
            ))
          ) : (
            <p className="p-3 text-sm text-gray-500">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
