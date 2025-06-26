import React from "react";

const Tabs = ({ items, activeIndex, onTabClick }) => {
  return (
    <div className="overflow-x-auto scrollbar-hide w-[330px] sm:w-full">
      <ul className="flex whitespace-nowrap space-x-4 px-2">
        {items.map((item, index) => (
          <li
            key={index}
            className={`inline-block border-b-2 ${
              activeIndex === index ? "border-[#0070ba]" : "border-gray-300"
            }`}
          >
            <button
              onClick={() => onTabClick(index)}
              className={`text-[#0070ba] border border-[#0070ba] hover:bg-[#0070ba] hover:text-white rounded-full px-8 py-2 my-2 sm:text-base text-xs ${
                activeIndex === index ? "font-semibold" : ""
              }`}
              style={{ minWidth: "120px" }}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tabs;
