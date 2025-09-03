"use client";

import { useSeniorCitizenContext } from "@/app/contexts/Seniorcitizen";
import React, { useEffect } from "react";
import { FaPaperclip, FaUserTie, FaFemale } from "react-icons/fa";

const SeniorCitizen = () => {
  const { uploading, handleFileChange, getAllSenior, allSenior } =
    useSeniorCitizenContext();

  useEffect(() => {
    getAllSenior();
  }, []);

  return (
    <div>
      <div className="flex md:flex-row flex-col justify-between md:items-end items-center bg-green-50/20 md:p-8 rounded-xl md:max-w-3xl w-full space-y-6">
        <h2 className="md:text-2xl text-xl font-semibold mb-4 flex items-center gap-2">
          <FaUserTie className="text-color" />
          <FaFemale className="text-color" />
          Senior Citizen Certificate
        </h2>

        <label
          htmlFor="upload-senior"
          className={`bg-[#0070ba] md:w-[50%]  cursor-pointer text-white flex items-center justify-center gap-2 
                       md:text-sm text-[8px] w-full lg:py-3 md:py-2 py-3 px-5 rounded-full mb-4 ${
                         uploading ? "opacity-50 cursor-not-allowed" : ""
                       }`}
        >
          <FaPaperclip className="text-base" />
          <span className="sm:text-sm text-xs">
            {uploading ? "Uploading..." : "Upload Senior Citizen Certificate"}
          </span>
          <input
            type="file"
            id="upload-senior"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="mt-8 md:max-w-3xl w-full flex flex-col items-start gap-3">
        {allSenior?.file_url ? (
          <>
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full 
      ${
        allSenior?.status === "verified"
          ? "bg-green-100 text-green-700"
          : allSenior?.status === "pending"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700"
      }`}
              >
                {allSenior?.status}
              </span>
            </div>

            {/* Certificate Image */}
            <div className="w-full rounded-xl border border-gray-300 shadow-sm overflow-hidden">
              <img
                src={allSenior?.file_url}
                alt="Senior Citizen Certificate"
                className="w-full h-auto object-contain cursor-pointer hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default SeniorCitizen;
