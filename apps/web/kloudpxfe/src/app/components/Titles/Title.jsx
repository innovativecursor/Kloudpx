import React from "react";

const Title = ({ text }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold dark-text ">{text}</h2>
      <div className="w-full mt-1 flex items-end">
        <div className="w-[20%]  h-[2px] bg-[#0070ba]"></div>
        <div className="w-[80%]  h-[1px] bg-gray-200"></div>
      </div>
    </div>
  );
};

export default Title;
