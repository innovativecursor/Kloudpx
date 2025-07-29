import React, { useState } from "react";

const PrescriptionHistoty = () => {
  const [activeTab, setActiveTab] = useState("current");
  const fallbackImage = "/assets/fallback.png";
  return (
    <div className="bg-blue-50/20 p-8 rounded-xl  max-w-3xl space-y-6">
      <h2 className="text-xl font-semibold mb-4">Prescription Summary</h2>
      <div className="flex border-b border-gray-300">
        {/* Current Tab */}
        <button
          className={`flex-1 text-center py-2 font-semibold ${
            activeTab === "current"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("current")}
        >
          Current
        </button>

        {/* Past Tab */}
        <button
          className={`flex-1 text-center py-2 font-semibold ${
            activeTab === "past"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("past")}
        >
          Past
        </button>
      </div>

      {/* Content */}
      <div className="p-4 min-h-[120px]">
        {activeTab === "current" ? (
          <div>Current Prescriptions Content here...</div>
        ) : (
          <div>Past Prescriptions Content here...</div>
        )}
      </div>

      {/* Footer Pagination Info */}
      {/* <div className="text-right text-xs text-gray-500">Showing 1/12</div> */}
    </div>
  );
};

export default PrescriptionHistoty;
