"use client";
const PrimaryButton = ({ title, className = "" }) => {
  return (
    <button
      className={`sm:text-xs font-normal text-[7px] bg-white cursor-pointer rounded-full text-black sm:py-1.5 py-0.5 px-2 sm:px-5 ${className}`}
    >
      {title}
      <i className="ri-arrow-right-s-line"></i>
    </button>
  );
};

export default PrimaryButton;
