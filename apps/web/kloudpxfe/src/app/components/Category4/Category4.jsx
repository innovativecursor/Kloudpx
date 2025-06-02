/* eslint-disable react/prop-types */
import React from "react";

function Category4({ data }) {
  return (
    <div className="bg-[#f5f6f9] py-12 px-4 mb-7">
      <div className="container mx-auto px-4">
        <div className="grid grid-flow-col auto-cols-max md:grid-flow-row md:auto-cols-auto md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible">
          {data.map((item, index) => (
            <div key={index} className="w-64 md:w-full">
              <div className="bg-white rounded-lg shadow-none">
                <div className="flex items-center p-4">
                  <div className="flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.paymentTitle}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="ml-4">
                    <h6 className="text-sm font-semibold text-gray-800 mb-0.5">
                      {item.paymentTitle}
                    </h6>
                    <span className="text-xs text-gray-500">
                      {item.paymentSubtitle}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Category4;
