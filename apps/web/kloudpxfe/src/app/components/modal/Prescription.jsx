"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePrescriptionContext } from "@/app/contexts/PrescriptionContext";
import { useAuth } from "@/app/contexts/AuthContext";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import Image from "next/image";
import prescriptionguide from "@/assets/prescriptionguide.jpeg";

const Prescription = () => {
  const {
    isOpen,
    setIsOpen,
    uploadedImage,
    uploadPrescription,
    loading,
    pendingCartData,
    handleSelectedPrescription,
    selectedPrescriptionId,
    setSelectedPrescriptionId,
    addMedicineToCartWithPrescription,
  } = usePrescriptionContext();
  const { token } = useAuth();
  const fallbackImage = "/assets/fallback.png";
  const { getAllPrescription, allPrescription } = usePrescriptionContext();
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedImage, setExpandedImage] = useState(null);
  const medicineid = pendingCartData?.medicineid;
  const quantity = pendingCartData?.quantity;

  useEffect(() => {
    if (!allPrescription || allPrescription.length === 0) {
      getAllPrescription();
    }
  }, []);

  // console.log(allPrescription);

  const modalRef = useRef(null);

  if (!isOpen) return null;

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);
  };

  const totalSlides = allPrescription ? allPrescription.length : 0;

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
        {/* all prescriptions... */}

        {allPrescription.length > 0 ? (
          <>
            <div className="md:mt-6 mt-1 md:py-0 md:px-0 px-4">
              <div className="flex md:hidden justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className=" text-gray-500 cursor-pointer hover:text-gray-900 font-bold"
                >
                  ✕
                </button>
              </div>
              <p className="md:text-center text-start tracking-wider sm:text-base text-sm mb-5 font-semibold dark-text">
                Would You Like To Upload A Prescription?
              </p>

              <div className=" flex items-center justify-center gap-2">
                <button
                  onClick={() => swiperRef.current?.slidePrev()}
                  className={`cursor-pointer py-2 px-4 md:block hidden rounded font-semibold ${
                    activeIndex > 0
                      ? " text-[#0070ba]"
                      : " text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={activeIndex === 0}
                >
                  <i className="ri-arrow-left-s-fill text-3xl"></i>
                </button>

                <div className="flex-1 md:max-w-[80%] w-full">
                  {/* Swiper for md and lg */}
                  <div className="hidden md:block">
                    <Swiper
                      modules={[Navigation]}
                      onSwiper={(swiper) => (swiperRef.current = swiper)}
                      spaceBetween={10}
                      slidesPerView={1}
                      onSlideChange={handleSlideChange}
                      breakpoints={{
                        768: {
                          slidesPerView: 1,
                          spaceBetween: 10,
                        },
                        1024: {
                          slidesPerView: 1,
                          spaceBetween: 10,
                        },
                      }}
                    >
                      {Array.isArray(allPrescription) &&
                      allPrescription.length > 0
                        ? allPrescription.map(({ ID, UploadedImage }) => (
                            <SwiperSlide key={ID} className="relative">
                              <div className="relative">
                                {/* Normal Image */}
                                <img
                                  src={UploadedImage || fallbackImage}
                                  alt="Prescription"
                                  className="cursor-pointer w-full h-56 border-2 border-gray-200 object-cover rounded-2xl shadow-md"
                                  onClick={() => {
                                    setSelectedPrescriptionId(ID);
                                    handleSelectedPrescription(ID);
                                  }}
                                />

                                {/* Expand Button (Bottom Center) */}
                                <div className="absolute bottom-0 right-0 ">
                                  <button
                                    className="bg-[#0070ba] text-white px-3 py-2 cursor-pointer text-xs rounded-br-2xl"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedImage(
                                        UploadedImage || fallbackImage
                                      );
                                    }}
                                  >
                                    <FiMaximize2 className="text-4xl" />
                                  </button>
                                </div>

                                {/* Selected Checkmark */}
                                {selectedPrescriptionId === ID && (
                                  <div className="absolute top-2 right-2 bg-green-600 rounded-full w-8 h-8 flex items-center justify-center text-white text-xl font-bold pointer-events-none">
                                    ✔
                                  </div>
                                )}
                              </div>
                            </SwiperSlide>
                          ))
                        : null}

                      {/* Expand Modal */}
                      {expandedImage && (
                        <div
                          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                          onClick={() => setExpandedImage(null)}
                        >
                          <div
                            className="relative rounded-lg shadow-lg w-fit px-12 py-8 h-[90%] bg-white overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Close Button Top-Right */}
                            <button
                              className="absolute top-0 right-0 bg-[#0070ba] text-white p-2  hover:bg-red-600 transition"
                              onClick={() => setExpandedImage(null)}
                            >
                              <FiMinimize2 className="text-xl" />
                            </button>

                            <img
                              src={expandedImage}
                              alt="Expanded"
                              className="w-full h-full object-contain rounded"
                            />
                          </div>
                        </div>
                      )}
                    </Swiper>
                  </div>

                  <div className="md:hidden max-h-64 sm:max-h-72 overflow-y-auto flex flex-col sm:gap-6 gap-4">
                    {Array.isArray(allPrescription) &&
                    allPrescription.length > 0
                      ? allPrescription.map(({ ID, UploadedImage }) => (
                          <div
                            key={ID}
                            className="relative flex-shrink-0 cursor-pointer"
                          >
                            <img
                              src={UploadedImage || fallbackImage}
                              alt="Prescription"
                              className={`w-full h-32 sm:h-40 object-cover rounded-lg shadow`}
                              onClick={() => {
                                setSelectedPrescriptionId(ID);
                                handleSelectedPrescription(ID);
                              }}
                            />

                            <div className="absolute bottom-0 right-0">
                              <button
                                className="bg-[#0070ba] text-white px-3 py-2 cursor-pointer text-xs rounded-br-lg"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedImage(
                                    UploadedImage || fallbackImage
                                  );
                                }}
                              >
                                <FiMaximize2 className="text-xl" />
                              </button>
                            </div>

                            {selectedPrescriptionId === ID && (
                              <div className="absolute top-2 right-2 bg-green-600 rounded-full w-8 h-8 flex items-center justify-center text-white text-xl font-bold pointer-events-none">
                                ✔
                              </div>
                            )}
                          </div>
                        ))
                      : null}

                    {expandedImage && (
                      <div
                        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                        onClick={() => setExpandedImage(null)}
                      >
                        <div
                          className="relative rounded-lg shadow-lg w-fit px-5 py-3 h-[90%] bg-white overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="absolute top-0 right-0 bg-[#0070ba] text-white p-2 hover:bg-red-600 transition"
                            onClick={() => setExpandedImage(null)}
                          >
                            <FiMinimize2 className="text-xl" />
                          </button>

                          <img
                            src={expandedImage}
                            alt="Expanded"
                            className="w-full h-full object-contain rounded"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => swiperRef.current?.slideNext()}
                  className={`cursor-pointer py-2 px-4 rounded  md:block hidden font-semibold ${
                    activeIndex < totalSlides - 1
                      ? " text-[#0070ba]"
                      : " text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={activeIndex === totalSlides - 1}
                >
                  <i className="ri-arrow-right-s-fill text-3xl"></i>
                </button>
              </div>
            </div>

            <div className="flex justify-center items-center md:px-0 px-4">
              <button
                className="bg-[#0070ba] text-sm cursor-pointer md:w-40 w-full  shadow h-10 font-medium mt-6 text-white rounded-md"
                onClick={async () => {
                  if (!selectedPrescriptionId) {
                    toast.error("Please select a prescription first.");
                    return;
                  }

                  if (!token) {
                    toast.error("User not authenticated.");
                    return;
                  }

                  if (!medicineid || !quantity) {
                    toast.error("Invalid medicine or quantity.");
                    return;
                  }

                  try {
                    await addMedicineToCartWithPrescription(
                      medicineid,
                      selectedPrescriptionId,
                      quantity
                    );

                    setIsOpen(false);
                  } catch (error) {
                    console.error(
                      "Cart error response:",
                      error.response?.data || error.message
                    );
                    toast.error(
                      error.response?.data?.message ||
                        "Failed to add item to cart."
                    );
                  }
                }}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center text-gray-500 pt-10">
              Please upload the prescription.
            </div>
          </>
        )}

        <div className="grid md:grid-cols-2 grid-cols-1 md:border-t-4 mt-9 border-[#EDF6FD] gap-6">
          <div className="flex flex-col justify-center items-center md:p-4">
            <h2 className="sm:text-base text-xs md:block hidden font-medium dark-text ">
              Upload Prescription
            </h2>
            <h1 className="text-[11px] opacity-50 md:block hidden font-medium mb-6 text-center">
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

          {/* Desktop View */}

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

          {allPrescription.length === 0 && !uploadedImage && (
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

export default Prescription;
