import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePrescriptionContext } from "../contexts/PrescriptionContext";
import { FaPhone } from "react-icons/fa6";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const PrescriptionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSinglePrescriptionData, singlePrescription } =
    usePrescriptionContext();

  const [zoomedImage, setZoomedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("unsettled");

  useEffect(() => {
    if (id) {
      getSinglePrescriptionData(id);
    }
  }, [id]);

  if (!singlePrescription) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 text-lg">
        Loading prescription details...
      </div>
    );
  }

  const { user, unsettled, past } = singlePrescription;

  return (
    <div className="md:p-6 mt-16 mx-[4vw]">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-extrabold text-[#0070ba] tracking-tight">
          Prescription Details
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0070ba] text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          <FaArrowLeft size={18} /> Back
        </button>
      </div>

      {/* User Info Circle Card */}
      <div className=" shadow-lg   p-8 mb-20 border border-gray-100 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-[#0070ba] flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{user?.name}</h2>

        {user?.email && (
          <p className="flex items-center gap-2 text-gray-600 mt-2">
            <FaEnvelope className="text-blue-500" /> {user.email}
          </p>
        )}

        {user?.phone && (
          <p className="flex items-center gap-2 text-gray-600 mt-2">
            <FaIdCard className="text-blue-500" /> {user.phone}
          </p>
        )}
        <p className="flex items-center gap-2 text-gray-600">
          <FaIdCard className="text-blue-500" /> ID: {user?.id}
        </p>
      </div>

      <div className="mb-32">
        <div className="mb-6">
          <div className="flex gap-4 border-b">
            <button
              onClick={() => setActiveTab("unsettled")}
              className={`px-6 py-3 text-lg font-medium ${
                activeTab === "unsettled"
                  ? "border-b-4 border-yellow-500 text-yellow-600"
                  : "text-gray-500 hover:text-yellow-600"
              }`}
            >
              Unsettled Prescriptions
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-6 py-3 text-lg font-medium ${
                activeTab === "past"
                  ? "border-b-4 border-green-500 text-green-600"
                  : "text-gray-500 hover:text-green-600"
              }`}
            >
              Past Prescriptions
            </button>
          </div>
        </div>

        {/* Unsettled Prescriptions */}
        {activeTab === "unsettled" && (
          <div>
            {unsettled && unsettled.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-8">
                {unsettled.map((item) => (
                  <div
                    key={item.ID}
                    className="bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
                  >
                    <img
                      src={item.UploadedImage}
                      alt="Prescription"
                      className="w-full h-56 object-cover cursor-pointer"
                      onClick={() => setZoomedImage(item.UploadedImage)}
                    />
                    <div className="p-5 space-y-2">
                      <p className="text-sm text-gray-500">
                        Uploaded:{" "}
                        <span className="font-medium text-gray-800">
                          {new Date(item.CreatedAt).toLocaleDateString()}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        <span className="text-yellow-600 font-semibold">
                          {item.Status}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium">Selected:</span>{" "}
                        {item.IsSelected ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : (
                          <FaTimesCircle className="text-red-500" />
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                No unsettled prescriptions.
              </p>
            )}
          </div>
        )}

        {/* Past Prescriptions */}
        {activeTab === "past" && (
          <div>
            {past && past.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-8">
                {past.map((item) => (
                  <div
                    key={item.ID}
                    className="bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
                  >
                    <img
                      src={item.UploadedImage}
                      alt="Prescription"
                      className="w-full h-56 object-cover cursor-pointer"
                      onClick={() => setZoomedImage(item.UploadedImage)}
                    />
                    <div className="p-5 space-y-2">
                      <p className="text-sm text-gray-500">
                        Uploaded:{" "}
                        <span className="font-medium text-gray-800">
                          {new Date(item.CreatedAt).toLocaleDateString()}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        <span className="text-green-600 font-semibold">
                          {item.Status}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No past prescriptions.</p>
            )}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setZoomedImage(null)}
        >
          <img
            src={zoomedImage}
            alt="Zoomed Prescription"
            className="max-h-[90%] max-w-[90%] rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default PrescriptionDetails;
