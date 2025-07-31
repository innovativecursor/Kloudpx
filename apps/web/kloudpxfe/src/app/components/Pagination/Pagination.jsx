"use client";
import React from "react";

const Pagination = ({
  totalPages,
  currentPage,
  handlePrev,
  handleNext,
  handlePageClick,
}) => {
  return (
    <div>
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-between items-center sm:mt-8 mt-5 p-1 sm:p-4 rounded">
          {/* Previous Button */}

          <button
            className="sm:px-5 bg-[#0070ba] sm:w-32 sm:py-4 w-14 px-2 py-1 cursor-pointer text-white font-normal tracking-wide sm:text-sm text-[9px] rounded-full flex justify-between items-center hover:bg-[#005fa3] disabled:opacity-50"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            <i className="ri-arrow-left-s-line sm:text-base text-sm"></i>
            <span>Prev</span>
          </button>

          {/* Page Numbers */}
          <div className="flex sm:gap-5 gap-2 overflow-x-auto scrollbar-hide">
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  className={` sm:text-lg text-xs w-5 h-5 sm:w-12 sm:h-12 text-color cursor-pointer font-medium rounded-full  ${
                    currentPage === page
                      ? "bg-blue-300/60"
                      : "bg-blue-100/60 hover:bg-blue-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next Button */}

          <button
            className="sm:px-5 bg-[#0070ba] sm:w-32 sm:py-4 w-14 px-2 py-1 cursor-pointer text-white font-normal tracking-wide sm:text-sm text-[9px] rounded-full flex justify-between items-center hover:bg-[#005fa3] disabled:opacity-50"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            <span>Next</span>
            <i className="ri-arrow-right-s-line text-base"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
