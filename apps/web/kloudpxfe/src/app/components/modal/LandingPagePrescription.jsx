"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePrescriptionContext } from "@/app/contexts/PrescriptionContext";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import prescriptionguide from "@/assets/prescriptionguide.jpeg";

const LandingPagePrescription = ({ isOpen, setIsOpen }) => {
  const {
    uploadedImage,
    uploadPrescription,
    loading,
    allPrescription,
    getAllPrescription,
  } = usePrescriptionContext();

  useEffect(() => {
    if (!allPrescription || allPrescription.length === 0) {
      getAllPrescription();
    }
  }, []);

  useEffect(() => {
    if (uploadedImage) {
      setIsOpen(false);
    }
  }, [uploadedImage, setIsOpen]);

  const modalRef = useRef(null);

  if (!isOpen) return null;

  console.log(allPrescription);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white"></div>
        </div>
      )}
      <div
        className="fixed inset-0 bg-black/40 cursor-pointer z-40"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Modal content */}
      <div
        role="dialog"
        aria-modal="true"
        ref={modalRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 cursor-pointer -translate-y-1/2 bg-white shadow-lg z-50  md:overflow-hidden md:h-fit h-fit md:mx-0  overflow-scroll w-[90%]  md:max-w-4xl rounded-xl "
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-1 right-4 cursor-pointer text-gray-500 hover:text-gray-900 text-xl font-bold z-50"
          aria-label="Close modal"
        >
          &times;
        </button>
        {/* all prescriptions... */}

        <div className="grid md:grid-cols-2 grid-cols-1 md:border-t-4 mt-9 border-[#EDF6FD] gap-6">
          <div className="flex flex-col justify-center items-center md:p-4">
            <h2 className="sm:text-base text-xs block font-medium dark-text ">
              Upload Prescription
            </h2>
            <h1 className="text-[11px] opacity-50 block font-medium mb-6 text-center">
              Please upload image of valid prescription from your doctor.
            </h1>

            <label
              className="flex flex-col md:mb-0 mb-8 items-center justify-center border md:px-0 px-4 border-dashed border-gray-900  rounded-lg md:p-4
             md:w-full w-[90%] bg-[#F6F5FA] md:h-48 h-32 cursor-pointer hover:border-[#0070BA]"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/4147/4147103.png"
                alt="Upload New"
                className="md:w-20 md:h-20 w-14 h-14 mb-2"
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

                  if (file) {
                    uploadPrescription(file);
                  }
                }}
              />
            </label>
            <div className="flex items-start sm:items-center gap-1 sm:mt-3 sm:mx-0 mb-4 mx-3">
              <span className="font-semibold text-[#0070ba] text-sm">
                Note:{" "}
              </span>
              <span className="text-[10px]">
                {" "}
                Always upload a clean version of your Prescription for better
                result.{" "}
              </span>
            </div>
          </div>

          {/* Right side - Guide / Preview */}
          <div className="bg-[#F6F5FA] md:block hidden">
            <div className="rounded-xl py-6 px-6 flex flex-col items-center justify-center">
              <h3 className="sm:text-sm dark-text font-semibold mb-4">
                Guide for Prescription
              </h3>
              <div className="w-full overflow-hidden rounded-md border border-gray-300 flex items-center justify-center">
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Prescription Preview"
                    className="object-contain w-full p-5 h-40 rounded-md"
                  />
                ) : allPrescription.length === 0 ? (
                  <Image
                    src={prescriptionguide}
                    alt="Prescription Guide"
                    className="w-full h-full p-3 object-cover"
                    priority
                  />
                ) : (
                  <div className="flex justify-center items-center text-gray-500 h-40 text-sm ">
                    Uploaded prescriptions are lis ted above.
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center justify-center tracking-wider mt-2">
                <h1 className="sm:text-xs text-[11px] font-semibold text-gray-700 mt-2">
                  Doctor Signature & Stamp:
                </h1>
                <h1 className="text-center opacity-60 text-[11px] mt-2">
                  The prescription with signature and stamp of doctor to be
                  considered valid.
                </h1>
              </div>
            </div>
          </div>

          {!loading && allPrescription.length === 0 && !uploadedImage && (
            <div className="md:hidden bg-[#F6F5FA] rounded-xl py-6 px-6 flex flex-col items-center justify-center">
              <Image
                src={prescriptionguide}
                alt="Prescription Guide"
                className="w-full h-full p-3 object-cover"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LandingPagePrescription;
