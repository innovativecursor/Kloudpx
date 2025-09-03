import React, { useEffect } from "react";
import { useSeniorCitizenContext } from "../contexts/SeniorCitizen";
import { format } from "date-fns";

const ScId = () => {
  const {
    getAllSeniorCitizen,
    allSeniorCitizen,
    getSingleCitizenData,
    singleCitizenData,
    isModalOpen,
    setIsModalOpen,
    isImageZoomed,
    setIsImageZoomed,
  } = useSeniorCitizenContext();

  useEffect(() => {
    if (!allSeniorCitizen || allSeniorCitizen.length === 0) {
      getAllSeniorCitizen();
    }
  }, []);

  const handleOpenModal = async (id) => {
    await getSingleCitizenData(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsImageZoomed(false);
  };

  return (
    <div className="md:p-6 mt-16 mx-[4vw]">
      <h1 className="text-3xl md:text-4xl text-[#0070ba] font-extrabold text-center mb-10 tracking-tight">
        All Senior Citizens IDs
      </h1>

      {allSeniorCitizen?.length === 0 ? (
        <p className="text-center text-gray-500">
          No pending certificates found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {allSeniorCitizen?.map((sen) => (
            <div
              key={sen.ID}
              onClick={() => handleOpenModal(sen.ID)}
              className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-md 
                           hover:shadow-2xl rounded-2xl overflow-hidden transform 
                           hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 cursor-pointer"
            >
              <img
                src={sen.FileURL}
                alt="PWD Certificate"
                className="w-full h-48 object-cover rounded-t-2xl hover:scale-105 
                             transition-transform duration-300"
              />

              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                      sen.Status.toLowerCase() === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {sen.Status}
                  </span>
                  <span className="text-xs text-gray-500 italic">
                    {format(new Date(sen.UploadedAt), "dd MMM yyyy")}
                  </span>
                </div>

                <p className="text-sm text-gray-800">
                  <span className="font-medium">👤 User ID:</span> {sen.UserID}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Modal */}
      {isModalOpen && singleCitizenData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-lg shadow-2xl relative border border-gray-200">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full 
                               bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 
                               shadow-sm transition"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6 text-[#0070ba] text-center">
              📑 Senior Citizens Details
            </h2>

            <img
              src={singleCitizenData.FileURL}
              alt="PWD Certificate"
              className="w-full h-56 object-contain rounded-lg border mb-6 cursor-zoom-in 
                               hover:scale-[1.02] transition-transform duration-300"
              onClick={() => setIsImageZoomed(true)}
            />

            <div className="space-y-2 text-gray-700 text-sm">
              <p>
                <span className="font-semibold">📌 Status:</span>{" "}
                {singleCitizenData.Status}
              </p>
              <p>
                <span className="font-semibold">👤 User ID:</span>{" "}
                {singleCitizenData.UserID}
              </p>
              <p>
                <span className="font-semibold">⏳ Uploaded At:</span>{" "}
                {format(new Date(singleCitizenData.UploadedAt), "dd MMM yyyy")}
              </p>
            </div>
          </div>
        </div>
      )}

      {isImageZoomed && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-[60] cursor-zoom-out"
          onClick={() => setIsImageZoomed(false)}
        >
          <img
            src={singleCitizenData.FileURL}
            alt="Zoomed Certificate"
            className="max-w-[95%] max-h-[95%] object-contain rounded-xl shadow-2xl border border-gray-700"
          />
        </div>
      )}
    </div>
  );
};

export default ScId;
