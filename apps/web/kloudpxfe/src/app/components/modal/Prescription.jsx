"use client";

import React, { useState, useRef, useEffect } from "react";

const Prescription = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="flex justify-center sm:mt-9 mt-6 md:w-1/2 w-[80%]">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-[#0070BA]/6 text-gray-600 hover:bg-[#0070BA]/20 hover:text-[#0070BA] w-full px-6 md:py-5 sm:py-3 py-2 rounded-md cursor-pointer md:text-sm text-xs font-medium flex justify-center gap-3 items-center"
          >
            <img
              src="/assets/prescription.png"
              alt="Upload"
              className="w-6 h-6 object-contain"
            />
            Upload Prescription
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40"></div>

          <div
            ref={menuRef}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     bg-white rounded-xl shadow-lg z-50 w-full max-w-6xl"
          >
            <div className="grid md:grid-cols-2 grid-cols-1 ">
              <div className="flex justify-center items-center tracking-wide">
                <div className="">
                  <h2 className="text-3xl dark-text font-semibold mb-2">
                    Upload Prescription
                  </h2>
                  <p className="text-sm  opacity-50 mt-4 font-medium  mb-6">
                    Please upload image of valid prescription from your doctor.
                  </p>

                  <div className="flex gap-5 mt-7 mb-6">
                    {/* Upload New */}
                    <label
                      className="flex flex-col items-center justify-center border-2
                     border-dashed border-[#0070BA]/40 rounded-lg p-4 w-1/2 h-44 cursor-pointer hover:border-[#0070BA]"
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/4147/4147103.png"
                        alt="Upload New"
                        className="w-20 h-20 mb-2"
                      />
                      <p className="text-base font-semibold dark-text ">
                        Upload New
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>

                    {/* Past Prescription () */}
                 
                  </div>

                  <hr className="border opacity-70  border-gray-300 mt-14 mb-10" />

                  <p className="text-sm tracking-wide  ">
                    <span className="font-bold text-color">Note:</span>
                    <span className="opacity-50 font-medium">
                      {" "}
                      Always upload a clean version of your <br /> prescription
                      for better result.
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-[#EDF6FD] rounded-xl py-12 px-9">
                <h3 className="text-2xl font-semibold mb-4 dark-text">
                  Guide for a valid prescription
                </h3>
                <div className="w-full h-72 overflow-hidden rounded-md ">
                  {uploadedImage ? (
                    <img
                      src={uploadedImage}
                      alt="Prescription Preview"
                      className="object-contain w-full h-full rounded-md"
                    />
                  ) : (
                    <h1 className="text-center text-sm opacity-60">
                      Upload Prescription{" "}
                    </h1>
                  )}
                </div>
                <div className="flex flex-col items-center justify-center tracking-wider mt-5">
                  <p className="text-lg font-semibold text-gray-700 mt-2">
                    Doctor Signature & Stamp:
                  </p>
                  <p className=" text-center opacity-60 text-sm mt-2">
                    The prescription with signature and stamp of doctor <br />{" "}
                    to be considered valid.
                  </p>{" "}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Prescription;













