"use client";

import React, { useEffect, useState } from "react";
import { usePwdContext } from "@/app/contexts/PwdContext";
import { FaPaperclip } from "react-icons/fa";

const Pwd = () => {
  const { uploading, handleFileChange, fileUrl, getAllPwd, allPwd } =
    usePwdContext();

  useEffect(() => {
    getAllPwd();
  }, []);
  return (
    <div>
      <div className="flex md:flex-row flex-col justify-between md:items-end items-center bg-blue-50/20 md:p-8 rounded-xl md:max-w-3xl w-full  space-y-6">
        <h2 className="md:text-2xl text-xl font-semibold mb-4">
          PWD Certificate
        </h2>

        <label
          htmlFor="upload"
          className={`bg-[#0070BA] md:w-[50%] hover:bg-[#005c96] cursor-pointer text-white flex items-center justify-center gap-2 
                       md:text-sm text-[8px] w-full lg:py-3 md:py-2 py-3 px-5 rounded-full mb-4 ${
                         uploading ? "opacity-50 cursor-not-allowed" : ""
                       }`}
        >
          <FaPaperclip className="text-base" />
          <span className="sm:text-sm text-xs">
            {uploading ? "Uploading..." : "Upload Pwd Certificate"}
          </span>
          <input
            type="file"
            id="upload"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="mt-8 md:max-w-3xl w-full flex flex-col items-start gap-3">
        {allPwd?.FileURL ? (
          <>
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full 
      ${
        allPwd?.Status === "approved"
          ? "bg-green-100 text-green-700"
          : allPwd?.Status === "pending"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700"
      }`}
              >
                {allPwd?.Status}
              </span>
            </div>

            {/* Certificate Image */}
            <div className="w-full rounded-xl border border-gray-300 shadow-sm overflow-hidden">
              <img
                src={allPwd?.FileURL}
                alt="PWD Certificate"
                className="w-full h-auto object-contain cursor-pointer hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Pwd;
