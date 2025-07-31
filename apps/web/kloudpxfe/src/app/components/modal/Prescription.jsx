"use client";

import React, { useRef } from "react";
import { usePrescriptionContext } from "@/app/contexts/PrescriptionContext";

const Prescription = () => {
  const {
    isOpen,
    setIsOpen,
    uploadedImage,
    uploadPrescription,
    loading,
    pendingCartData,
    uploadedPrescriptionId,
  } = usePrescriptionContext();

  const modalRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadPrescription(file);
  };

  if (!isOpen) return null;

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white"></div>
        </div>
      )}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Modal content */}
      <div
        role="dialog"
        aria-modal="true"
        ref={modalRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg z-50 md:h-fit md:overflow-hidden max-h-[80%] overflow-scroll w-[95%] lg:max-w-6xl md:max-w-4xl rounded-2xl "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
          {/* Left side - Upload */}
             <div className="flex justify-end mr-5 mt-2 items-end md:hidden">
              <button
                onClick={() => setIsOpen(false)}
                className=" text-gray-500 cursor-pointer hover:text-gray-900 font-bold"
              >
                 ✕
              </button>
            </div>

          <div className="flex flex-col justify-center items-center md:p-4">
         

                <h2 className="sm:text-3xl text-xl font-semibold md:mb-2">
              Upload Prescription
            </h2>
            <h1 className="text-sm opacity-50 mt-4 font-medium mb-6 text-center">
              Please upload image of valid prescription from your doctor.
            </h1>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#0070BA]/40 rounded-lg p-4 w-48 h-48 cursor-pointer hover:border-[#0070BA]">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4147/4147103.png"
                alt="Upload New"
                className="w-20 h-20 mb-2"
              />
              <h1 className="text-base font-semibold text-[#0070BA]">
                Upload New
              </h1>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (file && pendingCartData) {
                    const { medicineid, quantity } = pendingCartData;
                    uploadPrescription(file, medicineid, quantity);
                  }
                }}
              />
            </label>

            <hr className="border opacity-70 border-gray-300 mt-8 mb-6 w-full" />

            <h1 className="text-sm tracking-wide text-center">
              <span className="font-bold text-[#0070BA]">Note:</span> Always
              upload a clean version of your prescription for better result.
            </h1>
            {/* <div className="flex flex-col justify-center items-center md:p-4">
            <h2 className="sm:text-3xl text-xl font-semibold md:mb-2">
              Upload Prescription
            </h2>
            <p className="text-sm opacity-50 mt-4 font-medium mb-6 text-center">
              Please upload image of valid prescription from your doctor.
            </p>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#0070BA]/40 rounded-lg p-4 w-48 h-48 cursor-pointer hover:border-[#0070BA]">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4147/4147103.png"
                alt="Upload New"
                className="w-20 h-20 mb-2"
              />
              <p className="text-base font-semibold text-[#0070BA]">
                Upload New
              </p>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (file && pendingCartData) {
                    const { medicineid, quantity } = pendingCartData;
                    uploadPrescription(file, medicineid, quantity);
                  }
                }}
              />
            </label>

            <hr className="border opacity-70 border-gray-300 mt-8 mb-6 w-full" />

            <p className="text-sm tracking-wide text-center">
              <span className="font-bold text-[#0070BA]">Note:</span> Always
              upload a clean version of your prescription for better result.
            </p>
            </div> */}
          </div>

          {/* Right side - Guide / Preview */}
          <div className="bg-[#EDF6FD] p-4">
            <div className="md:flex justify-end hidden">
              <button
                onClick={() => setIsOpen(false)}
                className="mb-4 text-gray-500 cursor-pointer hover:text-gray-900 font-bold"
              >
                Close ✕
              </button>
            </div>
            <div className=" rounded-xl py-6 px-6 flex flex-col items-center justify-center">
              <h3 className="sm:text-2xl text-base font-semibold mb-4">
                Guide for a valid prescription
              </h3>
              <div className="w-full h-72 overflow-hidden rounded-md border border-gray-300 flex items-center justify-center">
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Prescription Preview"
                    className="object-contain w-full p-5 h-full rounded-md"
                  />
                ) : (
                  <h1 className="text-center text-sm opacity-60">
                    Upload Prescription
                  </h1>
                )}
              </div>
              <div className="flex flex-col items-center justify-center tracking-wider mt-5">
                <h1 className="sm:text-lg text-base font-semibold text-gray-700 mt-2">
                  Doctor Signature & Stamp:
                </h1>
                <h1 className="text-center opacity-60 md:text-sm text-xs mt-2">
                  The prescription with signature and stamp of doctor to be
                  considered valid.
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Prescription;
