"use client";
import React, { useState } from "react";

const PrescriptionHistoty = () => {
  const [activeTab, setActiveTab] = useState("current");
  const fallbackImage = "/assets/fallback.png";
  return (
    <div className="bg-blue-50/20 md:p-8 p-2 rounded-xl  md:max-w-3xl w-full space-y-6">
      <h2 className="text-xl md:text-start text-center font-semibold mb-4">
        Prescription Summary
      </h2>
      <div className="flex border-b mt-12 border-gray-300">
        {/* Current Tab */}
        <button
          className={`flex-1 text-center cursor-pointer py-2 font-semibold ${
            activeTab === "current"
              ? "text-[#0070ba] border-b-2 border-[#0070ba]"
              : "text-gray-600 hover:text-[#0070ba]"
          }`}
          onClick={() => setActiveTab("current")}
        >
          Current
        </button>

        {/* Past Tab */}
        <button
          className={`flex-1 text-center cursor-pointer py-2 font-semibold ${
            activeTab === "past"
              ? "text-[#0070ba] border-b-2 border-[#0070ba]"
              : "text-gray-600 hover:text-[#0070ba]"
          }`}
          onClick={() => setActiveTab("past")}
        >
          Past
        </button>
      </div>

      {/* Content */}
      <div className="p-4 min-h-[120px]">
        {activeTab === "current" ? (
          <div>Current Prescriptions here...</div>
        ) : (
          <div>Past Prescriptions here...</div>
        )}
      </div>

      {/* Footer Pagination Info */}
      {/* <div className="text-right text-xs text-gray-500">Showing 1/12</div> */}
    </div>
  );
};

export default PrescriptionHistoty;
