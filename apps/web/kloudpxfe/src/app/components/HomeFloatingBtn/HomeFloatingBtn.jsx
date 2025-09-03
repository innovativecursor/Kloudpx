"use client";
import { useState, useEffect } from "react";
import { IoChevronUp } from "react-icons/io5";

const HomeFloatingBtn = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 left-6 z-50 flex sm:h-14 sm:w-14 h-10 w-10 items-center justify-center rounded-full bg-[#0070ba] text-white shadow-lg transition-all duration-300 hover:bg-[#0070ba]/80 cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#0070ba] focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          <IoChevronUp size={24} />
        </button>
      )}
    </>
  );
};

export default HomeFloatingBtn;
