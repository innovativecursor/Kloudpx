"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getAxiosCall } from "@/app/lib/axios";
import endpoints from "@/app/config/endpoints";
import { generateSlug } from "@/app/utils/slugify";
import { useRouter } from "next/navigation";
import usePageLoader from "@/app/hooks/usePageLoader";

// ✅ Debounce function
function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export default function SearchBar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const { startLoader } = usePageLoader();
  const searchbar = "/assets/searchbar.jpg";
  const fallbackImage = "/assets/fallback.png";
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = debounce(async (query) => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await getAxiosCall(
        endpoints.search.get(query),
        {},
        false,
        false
      );
      setResults(res?.data?.medicines || []);
      setShowDropdown(true);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    fetchSuggestions(searchTerm);
  }, [searchTerm]);

  const handleClicked = (id, genericname) => {
    const slug = generateSlug(genericname);
    startLoader(`/Products/${slug}/${id}`);
    router.push(`/Products/${slug}/${id}`);
    setShowDropdown(false);
  };

  // console.log(results);

  return (
    <div
      ref={wrapperRef}
      className="relative lg:max-w-4xl md:max-w-lg w-full sm:mx-auto"
    >
      <div className="flex items-center md:h-14 h-12 bg-[#EDF4F6] rounded-full overflow-hidden border-2 border-transparent hover:border-[#0070ba] focus-within:border-[#0070ba] transition-all duration-200 cursor-pointer">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for products, categories or brands..."
          className="flex-grow px-6 md:py-4 py-2 bg-transparent text-sm w-60 sm:w-full text-gray-800 placeholder-gray-600 focus:outline-none sm:placeholder:text-xs placeholder:text-[10px]  "
        />
        {/* <button className="bg-[#006EBB] md:w-20 w-16 md:p-4 p-2">
          <i className="ri-search-line text-white text-2xl"></i>
        </button> */}

        {/* <button className="bg-[#006EBB] w-12 md:w-20 p-2 md:p-4 flex justify-center items-center">
          <i className="ri-search-line text-white text-xl md:text-2xl"></i>
        </button> */}

        <button className="bg-[#006EBB] w-12 md:w-20 p-2 md:p-4 flex justify-center items-center">
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <i className="ri-search-line text-white text-xl md:text-2xl"></i>
          )}
        </button>
      </div>

      {showDropdown && (
        <ul className="absolute z-50 w-full py-4 px-4 bg-white rounded-2xl mt-4 thin-scrollbar border border-gray-300 max-h-96 overflow-y-auto shadow-md">
          {results?.length > 0 ? (
            results.map((item, idx) => (
              <li
                key={idx}
                // onClick={() => handleSelect(item)}
                onClick={() => handleClicked(item?.id, item?.genericname)}
                className="flex items-center gap-4 px-4 py-3 hover:bg-[#F0F6FF] transition rounded-lg cursor-pointer"
              >
                <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={item.images?.[0] ? item.images[0] : fallbackImage}
                    alt={item.brandname || "Image"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 text-[15px]">
                    {item.genericname}
                  </span>
                  <span className="text-xs text-gray-500">
                    {item.brandname}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-6">
              <div className="flex flex-col items-center justify-center gap-3 text-center">
                <div className="relative w-32 h-32 opacity-70">
                  <Image
                    src={searchbar}
                    alt="No results"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-gray-600 md:text-base sm:text-sm text-xs font-medium">
                  Oops! No matches found for{" "}
                  <span className="text-[#006EBB] font-semibold">
                    {searchTerm}
                  </span>
                </div>
                <h1 className="sm:text-sm text-xs text-gray-500">
                  Get in touch with our pharmacist instead?
                </h1>
                <div className="flex sm:text-sm text-[9px] items-center gap-2 text-[#006EBB] font-medium mt-1">
                  <i className="ri-phone-line"></i>
                  <span>Call a pharmacist: +63 998 972 1498</span>
                </div>
              </div>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
