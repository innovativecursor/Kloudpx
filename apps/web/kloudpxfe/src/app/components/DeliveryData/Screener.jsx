"use client";

import React, { useState } from "react";
import { FaPaperclip } from "react-icons/fa";

const Screener = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [gcashNumber, setGcashNumber] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="w-full mt-10 py-8 px-6 bg-[#EDF4F6] rounded-lg ">
      <div className="">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-semibold tracking-wide text-2xl text-[#00243f] mb-2">
              Pay via Gcash
            </h2>
            <p className="text-[#00243f] text-2xl mb-1 font-light">
              Payable amount
            </p>
            <p className="text-[#0070BA] mt-3 text-3xl font-normal mb-6">
              ₱1200
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <img
              src="/qr-code.png"
              alt="QR Code"
              className="w-40 h-40 object-contain"
            />
          </div>
        </div>

        <div className="flex justify-between items-start mt-12 mb-4">
          <div className=" w-[45%]">
            <label
              htmlFor="upload"
              className="bg-[#0070BA] hover:bg-[#005c96] cursor-pointer text-white flex items-center justify-center gap-2 text-sm py-3 px-5 rounded-full w-full mb-4"
            >
              <FaPaperclip className="text-xs" />
              <span className="text-xs">
                Upload Gcash Payment
                </span>
              <input
                type="file"
                id="upload"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </label>
            <p className="text-center text-sm text-gray-500 mb-4">or</p>
            <div className="relative">
              <input
                type="text"
                placeholder="Provide Gcash Payment Number"
                value={gcashNumber}
                onChange={(e) => setGcashNumber(e.target.value)}
                className="w-full border-b border-[#00243f] bg-transparent text-sm py-2 px-1 outline-none placeholder:text-[#00243f]"
              />
            </div>
          </div>

          <div className=" w-[45%]">
            <div className="w-full">
              <p className="font-medium text-sm mb-1 text-[#00243f]">Preview</p>
              <div className="rounded-md overflow-hidden shadow">
                {selectedFile ? (
                  <img
                    src={selectedFile}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                    No file selected
                  </div>
                )}
              </div>
            </div>
          </div>



        </div>
      </div>
    </div>
  );
};

export default Screener;
