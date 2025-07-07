import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Searchbar from "../../Components/searchbar/Searchbar";
import { usePrescriptionContext } from "../../contexts/PrescriptionContext";
import CustomModal from "../../Components/modal/CustomModal";
import UserCart from "../../Components/usercart/UserCart";

const PrescriptionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { prescriptionDetails, getPrescriptionDetails } =
    usePrescriptionContext();

  useEffect(() => {
    if (id) {
      getPrescriptionDetails(id);
    }
  }, [id]);

  const details = prescriptionDetails?.data;
  if (!details) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 pb-32">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 font-semibold text-sm hover:underline transition"
          aria-label="Go back to all prescriptions"
        >
          ← Back to all prescriptions
        </button>
        <Searchbar />
      </div>

      {/* Main Prescription Info Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2 gap-8">
        {/* Image section */}
        <div className="h-96 relative bg-gray-100 rounded-l-3xl overflow-hidden group shadow-md">
          <img
            src={details.UploadedImage}
            alt="Prescription"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
          <span className="absolute top-5 right-5 bg-white border border-gray-300 shadow-md px-4 py-1 rounded-full text-sm font-semibold text-gray-700 select-none">
            ID: #{details.ID}
          </span>
        </div>

        {/* Details section */}
        <div className="p-8 space-y-8 text-gray-900">
          {/* Patient Name */}
          <div>
            <h4 className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
              Patient Name
            </h4>
            <p className="text-2xl font-bold capitalize">
              {details.User?.FirstName || "N/A"}
            </p>
          </div>

          {/* Status */}
          <div>
            <h4 className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
              Status
            </h4>
            <span
              className={`inline-block px-4 py-1 rounded-full text-sm font-semibold capitalize ${
                details.Status === "past"
                  ? "bg-green-100 text-green-800"
                  : details.Status === "unsettled"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {details.Status}
            </span>
          </div>

          {/* Uploaded On */}
          <div>
            <h4 className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
              Uploaded On
            </h4>
            <p className="text-lg font-medium">
              {new Date(details.CreatedAt).toLocaleDateString()}
            </p>
          </div>

          {/* User ID */}
          <div>
            <h4 className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
              User ID
            </h4>
            <p className="text-lg font-medium">{details.UserID}</p>
          </div>
        </div>
      </div>

      {/* User Cart & Modal */}
      <UserCart details={details} />
      <CustomModal />
    </div>
  );
};

export default PrescriptionDetails;
