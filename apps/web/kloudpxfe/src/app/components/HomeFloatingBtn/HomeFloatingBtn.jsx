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
          className="fixed bottom-12 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-slate-600 text-white shadow-lg transition-all duration-300 hover:bg-slate-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          <IoChevronUp size={24} />
        </button>
      )}
    </>
  );
};

export default HomeFloatingBtn;
