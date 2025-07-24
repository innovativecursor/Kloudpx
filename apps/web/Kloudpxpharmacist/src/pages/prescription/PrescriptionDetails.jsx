import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePrescriptionContext } from "../../contexts/PrescriptionContext";
import CustomModal from "../../Components/modal/CustomModal";

const PrescriptionDetails = () => {
  const { userid } = useParams();
  const { allPrescriptions, prescriptionDetails, fetchPrescriptionsDetails } =
    usePrescriptionContext();

  const [activeTab, setActiveTab] = useState("unsettled");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPrescription(null);
  };

  useEffect(() => {
    if (userid) fetchPrescriptionsDetails(userid);
  }, [userid]);

  const userInfo = allPrescriptions.find(
    (user) => Number(user.userid) === Number(userid)
  );

  const { unsettled = [], past = [] } = prescriptionDetails || {};

  const handleCardClick = (item) => {
    setSelectedPrescription(item);
    setIsModalOpen(true);
  };

  const renderCards = (data) => {
    if (!data || data?.length === 0) {
      return <p className="text-gray-500 mt-4">No data available.</p>;
    }

    return (
      <div className="grid grid-cols-1 mb-32 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12">
        {data.map((item) => (
          <div
            key={item.ID}
            onClick={() => handleCardClick(item)}
            className="cursor-pointer bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition duration-300"
          >
            {item.UploadedImage ? (
              <img
                src={item.UploadedImage}
                alt="Uploaded"
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                No Image Available
              </div>
            )}
            <div className="p-4">
              <p className="text-base font-semibold text-gray-700 mb-1">
                👤 User ID: <span className="text-black">{item.UserID}</span>
              </p>
              <p className="text-sm text-gray-600">
                📌 Status:{" "}
                <span
                  className={`px-3 py-1 text-xs rounded-full font-bold ${
                    (item.Status || "unsettled") === "unsettled"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {item.Status || "unsettled"}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 md:mt-20 mt-12 md:mx-[5vw] mx-2">
      {/* User Info */}
      <div className="max-w-md mx-auto mb-8 bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
        <div className="w-16 h-16 bg-[#0070ba] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-md">
          {userInfo?.name?.charAt(0) || "U"}
        </div>
        <p className="text-xl font-semibold text-gray-800">
          {userInfo?.name || "Unknown User"}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {userInfo?.email || "Not Found"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex mt-12 gap-12 mb-4 flex-wrap">
        <button
          className={`px-12 py-3 rounded-full ${
            activeTab === "past"
              ? "bg-[#0070ba] text-white"
              : "bg-gray-300 text-gray-900"
          }`}
          onClick={() => setActiveTab("past")}
        >
          Past ({past?.length})
        </button>
        <button
          className={`px-12 py-3 rounded-full ${
            activeTab === "unsettled"
              ? "bg-[#0070ba] text-white"
              : "bg-gray-300 text-gray-900"
          }`}
          onClick={() => setActiveTab("unsettled")}
        >
          Unsettled ({unsettled?.length})
        </button>
      </div>

      {/* Cards */}
      {activeTab === "unsettled" && renderCards(unsettled)}
      {activeTab === "past" && renderCards(past)}

      {/* Modal */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedPrescription={selectedPrescription}
      />
    </div>
  );
};

export default PrescriptionDetails;
