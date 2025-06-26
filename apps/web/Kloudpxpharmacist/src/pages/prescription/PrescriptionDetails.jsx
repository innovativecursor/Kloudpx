import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Searchbar from "../../Components/searchbar/Searchbar";
import { usePrescriptionContext } from "../../contexts/PrescriptionContext";
import CustomModal from "../../Components/modal/CustomModal";

const PrescriptionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    prescriptionDetails,
    prescriptionsCart,
    getPrescriptionDetails,
    submitPrescriptions,
  } = usePrescriptionContext();

  useEffect(() => {
    if (id) {
      getPrescriptionDetails(id);
    }
  }, [id]);

  const details = prescriptionDetails?.data;
  if (!details) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-32">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 font-medium text-sm hover:underline"
        >
          ← Back to all prescriptions
        </button>
        <Searchbar />
      </div>

      {/* Main Prescription Info Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">
        <div className="h-[24rem] relative group bg-gray-50">
          <img
            src={details.UploadedImage}
            alt="Prescription"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-4 right-4 bg-white border shadow px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
            ID: #{details.ID}
          </span>
        </div>

        <div className="p-6 space-y-6 text-gray-800">
          <div>
            <h4 className="text-xs text-gray-500 uppercase mb-1">
              Patient Name
            </h4>
            <p className="text-lg font-semibold capitalize">
              {details.User?.FirstName || "N/A"}
            </p>
          </div>

          <div>
            <h4 className="text-xs text-gray-500 uppercase mb-1">Status</h4>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                details.Status === "past"
                  ? "bg-green-100 text-green-700"
                  : details.Status === "unsettled"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {details.Status}
            </span>
          </div>

          <div>
            <h4 className="text-xs text-gray-500 uppercase mb-1">
              Uploaded On
            </h4>
            <p className="text-base font-medium">
              {new Date(details.CreatedAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <h4 className="text-xs text-gray-500 uppercase mb-1">User ID</h4>
            <p className="text-base font-medium">{details.UserID}</p>
          </div>
        </div>
      </div>

      {/* Prescriptions Cart */}
      <div className="mt-10 max-w-6xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">User's Cart</h3>
        {prescriptionsCart.loading && <p>Loading cart...</p>}
        {prescriptionsCart.error && (
          <p className="text-red-600">Error: {prescriptionsCart.error}</p>
        )}
        {prescriptionsCart.data && prescriptionsCart.data.length > 0 ? (
          <table className="w-full border border-gray-300 rounded-md overflow-hidden text-left text-sm shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b border-gray-300">Medicine Name</th>
                <th className="p-3 border-b border-gray-300">Quantity</th>
                <th className="p-3 border-b border-gray-300">Created At</th>
                <th className="p-3 border-b border-gray-300">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {prescriptionsCart.data.map((item) => (
                <tr key={item.ID} className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-300">
                    {item.Medicine?.BrandName || "N/A"}
                  </td>
                  <td className="p-3 border-b border-gray-300">
                    {item.Quantity}
                  </td>
                  <td className="p-3 border-b border-gray-300">
                    {new Date(item.CreatedAt).toLocaleString()}
                  </td>
                  <td className="p-3 border-b border-gray-300">
                    {item.UpdatedAt && item.UpdatedAt !== "0001-01-01T00:00:00Z"
                      ? new Date(item.UpdatedAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No items in cart.</p>
        )}

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={submitPrescriptions}
            className="bg-[#0070ba] text-white font-semibold py-3 px-8 rounded-md shadow-md hover:bg-[#005f8d] transition duration-300"
          >
            Submit Prescriptions
          </button>
        </div>
      </div>
      <CustomModal />
    </div>
  );
};

export default PrescriptionDetails;
