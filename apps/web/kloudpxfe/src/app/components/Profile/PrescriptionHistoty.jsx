"use client";

import { useProfileContext } from "@/app/contexts/ProfileContext";
import React, { useEffect, useState } from "react";

const PrescriptionHistoty = () => {
  const [activeTab, setActiveTab] = useState("current");
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 3;
  const { getAllPrescriptionHistory, prescriptionHistory } =
    useProfileContext();

  useEffect(() => {
    getAllPrescriptionHistory();
  }, []);

  const fallbackImage = "/assets/fallback.png";

  const renderImages = (prescriptions) => {
    if (!prescriptions || prescriptions.length === 0) {
      return (
        <div className="text-gray-500 text-center mt-4">
          No prescriptions found.
        </div>
      );
    }

    // Pagination logic
    const indexOfLastImage = currentPage * imagesPerPage;
    const indexOfFirstImage = indexOfLastImage - imagesPerPage;
    const currentImages = prescriptions.slice(
      indexOfFirstImage,
      indexOfLastImage
    );
    const totalPages = Math.ceil(prescriptions.length / imagesPerPage);

    return (
      <>
        <div className="flex flex-col gap-6">
          {currentImages.map((p) => (
            <img
              key={p.id}
              src={p.image || fallbackImage}
              alt={`Prescription ${p.id}`}
              className="w-full h-full object-cover border-2 border-[#0070ba] p-3 rounded-xl"
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              className={`px-3 py-1 rounded-lg border ${
                currentPage === 1
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "text-[#0070ba] border-[#0070ba] hover:bg-[#0070ba]/10"
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="text-gray-600 font-medium">
              {currentPage} / {totalPages}
            </span>
            <button
              className={`px-3 py-1 rounded-lg border ${
                currentPage === totalPages
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "text-[#0070ba] border-[#0070ba] hover:bg-[#0070ba]/10"
              }`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </>
    );
  };

  // Reset page when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="bg-blue-50/20 md:p-8 p-2 rounded-xl md:max-w-3xl w-full space-y-6">
      <h2 className="text-xl md:text-start text-center font-semibold mb-4">
        Prescription Summary
      </h2>

      {/* Tabs */}
      <div className="flex border-b mt-4 border-gray-300">
        <button
          className={`flex-1 text-center cursor-pointer py-2 font-semibold ${
            activeTab === "current"
              ? "text-[#0070ba] border-b-2 border-[#0070ba]"
              : "text-gray-600 hover:text-[#0070ba]"
          }`}
          onClick={() => handleTabChange("current")}
        >
          Current
        </button>
        <button
          className={`flex-1 text-center cursor-pointer py-2 font-semibold ${
            activeTab === "past"
              ? "text-[#0070ba] border-b-2 border-[#0070ba]"
              : "text-gray-600 hover:text-[#0070ba]"
          }`}
          onClick={() => handleTabChange("past")}
        >
          Past
        </button>
      </div>

      {/* Images */}
      <div className="p-4 min-h-[120px]">
        {activeTab === "current"
          ? renderImages(prescriptionHistory?.todays_prescriptions)
          : renderImages(prescriptionHistory?.past_prescriptions)}
      </div>
    </div>
  );
};

export default PrescriptionHistoty;
