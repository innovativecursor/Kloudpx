import React from 'react';

const TitleSlider = ({ title, prevRef, nextRef }) => {
    return (
        <div className="flex-between-center sm:mb-7 mb-5">
            <h2 className="sm:text-2xl text-xl font-semibold">{title}</h2>
            <div className="flex gap-3">
                <button
                    ref={prevRef}
                    className=" rounded-full sm:w-7 sm:h-7 w-6 h-6 cursor-pointer flex items-center border border-[#0070BA]"
                >
                    <i className="ri-arrow-left-s-line text-color sm:text-2xl text-xl"></i>
                </button>
                <button
                    ref={nextRef}
                    className=" rounded-full sm:w-7 sm:h-7 w-6 h-6 border flex cursor-pointer items-center border-[#0070BA]"
                >
                    <i className="ri-arrow-right-s-line text-color sm:text-2xl text-xl"></i>
                </button>
            </div>
        </div>
    );
};

export default TitleSlider;




