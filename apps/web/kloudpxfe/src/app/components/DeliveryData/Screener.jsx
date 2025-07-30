"use client";

import React, { useState } from "react";
import { FaPaperclip } from "react-icons/fa";

const Screener = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [gcashNumber, setGcashNumber] = useState("");

  const handleFileChange = (e) => {
    // setSelectedFile(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="w-full mt-10 py-8 px-6 bg-[#EDF4F6] rounded-lg ">
      <div className="">
        <div className="flex justify-between md:flex-row flex-col items-start">
          <div>
            <h2 className="font-semibold tracking-wide text-2xl text-[#00243f] mb-2">
              Pay via Gcash
            </h2>
            <span className="text-[#00243f] text-2xl mb-1 font-light">
              Payable amount
            </span>
            <h1 className="text-[#0070BA] mt-3 text-3xl font-normal mb-6">
              ₱1200
            </h1>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <img
              src="/qr-code.png"
              alt="QR Code"
              className="lg:w-40 lg:h-40 sm:w-32 sm:h-32 w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="flex justify-between sm:flex-row flex-col items-start mt-12 mb-4">
          <div className=" sm:w-[45%] w-full">
            <label
              htmlFor="upload"
              className="bg-[#0070BA] hover:bg-[#005c96] cursor-pointer text-white flex items-center justify-center gap-2 
              text-sm lg:py-3 py-2 px-5 rounded-full w-full mb-4"
            >
              <FaPaperclip className="text-xs" />
              <span className="lg:text-xs text-[11px]">
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
            <h2 className="text-center text-sm text-gray-500 mb-4">or</h2>
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

          <div className=" sm:w-[45%] w-full sm:mt-0 mt-10">
            <div className="w-full">
              <h1 className="font-medium text-sm mb-1 text-[#00243f]">Preview</h1>
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





// import React from 'react'

// const Screener = () => {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default Screener
