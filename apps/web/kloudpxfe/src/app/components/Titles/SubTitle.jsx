"use client";
import React from "react";

const SubTitle = ({ paths }) => {
  return (
    <div className="opacity-60 text-xs font-medium cursor-pointer uppercase">
      {paths.map((item, index) => (
        <span key={index}>
          {item}
          {index !== paths?.length - 1 && (
            <i className="ri-arrow-right-s-line mx-1"></i>
          )}
        </span>
      ))}
    </div>
  );
};

export default SubTitle;
