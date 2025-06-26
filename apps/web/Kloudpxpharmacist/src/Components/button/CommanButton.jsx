import React from "react";

const CommonButton = ({
  onClick,
  disabled = false,
  children,
  className = "",
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-5 py-2.5
        rounded-lg
        font-semibold
        text-[#0070ba]
        border-2 border-[#0070ba]
        shadow-md
        active:scale-95 active:shadow-sm
        focus:outline-none focus:ring-4 focus:ring-[#3399ff]
        disabled:opacity-50 disabled:cursor-not-allowed
        transition
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default CommonButton;
