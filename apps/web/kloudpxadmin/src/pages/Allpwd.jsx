import React, { useEffect } from "react";
import { usePwdContext } from "../contexts/Pwdcontext";
import { format } from "date-fns";

const Allpwd = () => {
  const {
    getAllPendingPwds,
    allPendingPwds,
    getSinglePendingPwd,
    singlePwd,
    isModalOpen,
    setIsModalOpen,
    isImageZoomed,
    setIsImageZoomed,
    action,
    setAction,
    verifyPendingPwd,
  } = usePwdContext();

  useEffect(() => {
    getAllPendingPwds();
  }, []);

  const handleOpenModal = async (id) => {
    await getSinglePendingPwd(id);
    setIsModalOpen(true);
    setAction("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsImageZoomed(false);
    setAction("");
  };

  return (
    <div className="md:p-6 mt-16 mx-[4vw]">
      <h1 className="text-3xl md:text-4xl text-[#0070ba] font-extrabold text-center mb-10 tracking-tight">
        All Pending PWD Certificates..
      </h1>

      {allPendingPwds?.length === 0 ? (
        <p className="text-center text-gray-500">
          No pending certificates found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPendingPwds?.map((pwd) => (
            <div
              key={pwd.ID}
              onClick={() => handleOpenModal(pwd.ID)}
              className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-md 
                         hover:shadow-2xl rounded-2xl overflow-hidden transform 
                         hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 cursor-pointer"
            >
              <img
                src={pwd.FileURL}
                alt="PWD Certificate"
                className="w-full h-48 object-cover rounded-t-2xl hover:scale-105 
                           transition-transform duration-300"
              />

              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                      pwd.Status.toLowerCase() === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {pwd.Status}
                  </span>
                  <span className="text-xs text-gray-500 italic">
                    {format(new Date(pwd.UploadedAt), "dd MMM yyyy")}
                  </span>
                </div>

                <p className="text-sm text-gray-800">
                  <span className="font-medium">👤 User ID:</span> {pwd.UserID}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Modal */}
      {isModalOpen && singlePwd && (
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
              📑 PWD Certificate Details
            </h2>

            <img
              src={singlePwd.FileURL}
              alt="PWD Certificate"
              className="w-full h-56 object-contain rounded-lg border mb-6 cursor-zoom-in 
                         hover:scale-[1.02] transition-transform duration-300"
              onClick={() => setIsImageZoomed(true)}
            />

            <div className="space-y-2 text-gray-700 text-sm">
              <p>
                <span className="font-semibold">📌 Status:</span>{" "}
                {singlePwd.Status}
              </p>
              <p>
                <span className="font-semibold">👤 User ID:</span>{" "}
                {singlePwd.UserID}
              </p>
              <p>
                <span className="font-semibold">⏳ Uploaded At:</span>{" "}
                {format(new Date(singlePwd.UploadedAt), "dd MMM yyyy HH:mm")}
              </p>
              <p>
                <span className="font-semibold">✔ Verified By:</span>{" "}
                {singlePwd.VerifiedBy || "Not Verified"}
              </p>
            </div>

            {/* Dropdown */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⚡ Select Action
              </label>
              <select
                value={action}
                onChange={(e) => {
                  const selectedAction = e.target.value;
                  setAction(selectedAction);

                  if (selectedAction) {
                    verifyPendingPwd(selectedAction);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
             focus:outline-none focus:ring-2 focus:ring-[#0070ba] 
             focus:border-[#0070ba] transition"
              >
                <option value="">-- Choose an option --</option>
                <option value="approved">✅ Approve</option>
                <option value="rejected">❌ Reject</option>
              </select>
            </div>

            {action && (
              <p className="mt-4 text-sm text-gray-600 text-center">
                Selected Action:{" "}
                <span className="font-semibold capitalize text-[#0070ba]">
                  {action}
                </span>
              </p>
            )}
          </div>
        </div>
      )}

      {isImageZoomed && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-[60] cursor-zoom-out"
          onClick={() => setIsImageZoomed(false)}
        >
          <img
            src={singlePwd.FileURL}
            alt="Zoomed Certificate"
            className="max-w-[95%] max-h-[95%] object-contain rounded-xl shadow-2xl border border-gray-700"
          />
        </div>
      )}
    </div>
  );
};

export default Allpwd;
