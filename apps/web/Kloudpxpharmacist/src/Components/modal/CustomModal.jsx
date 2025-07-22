import React, { useEffect } from "react";
import { usePrescriptionContext } from "../../contexts/PrescriptionContext";
import Swal from "sweetalert2";

const CustomModal = ({ isOpen, onClose, selectedPrescription }) => {
  const {
    fetchPrescriptionCartById,
    prescriptionCart,
    approvePrescription,
    fetchPrescriptionsDetails,
    fetchAllPrescriptions,
    rejectPrescription
  } = usePrescriptionContext();

  useEffect(() => {
    if (isOpen && selectedPrescription?.ID) {
      fetchPrescriptionCartById(selectedPrescription.ID);
    }
  }, [isOpen, selectedPrescription]);

  if (!isOpen) return null;

  const handleApprove = async () => {
    if (!selectedPrescription?.ID) return;

    const res = await approvePrescription(selectedPrescription.ID);

    if (res) {
      await fetchPrescriptionsDetails(selectedPrescription.UserID);
      await fetchPrescriptionCartById(selectedPrescription.ID);
      await fetchAllPrescriptions();

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Prescription approved successfully!",
        timer: 2000,
        showConfirmButton: false,
      });

      onClose();
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to approve prescription.",
      });
    }
  };



  const handleReject = async () => {
    if (!selectedPrescription?.ID) return;

    console.log(selectedPrescription?.ID);


    const res = await rejectPrescription(selectedPrescription.ID);

    if (res) {
      await fetchPrescriptionsDetails(selectedPrescription.UserID);
      await fetchPrescriptionCartById(selectedPrescription.ID);
      await fetchAllPrescriptions();

      Swal.fire({
        icon: "success",
        title: "Rejected!",
        text: "Prescription rejected successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      onClose();
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to reject prescription.",
      });
    }
  };


  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
        >
          &times;
        </button>

        {/* Modal Body */}
        {selectedPrescription ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
              📄 Prescription #{selectedPrescription.ID}
            </h2>

            {selectedPrescription.UploadedImage ? (
              <img
                src={selectedPrescription.UploadedImage}
                alt="Prescription"
                className="w-full h-64 object-contain rounded-lg border"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500">
                No Image Available
              </div>
            )}

            {/* Table for Cart Items */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                🛒 Prescription Cart
              </h3>

              {Array.isArray(prescriptionCart) &&
                prescriptionCart.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left border">
                    <thead className="bg-gray-200 text-gray-700 font-semibold">
                      <tr>
                        <th className="px-4 py-2 border">Category</th>
                        <th className="px-4 py-2 border">Brand</th>
                        <th className="px-4 py-2 border">Generic</th>
                        <th className="px-4 py-2 border">Power</th>
                        <th className="px-4 py-2 border">Quantity</th>
                        <th className="px-4 py-2 border">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptionCart.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border">
                            {item.Medicine?.Category?.CategoryName || "N/A"}
                          </td>
                          <td className="px-4 py-2 border">
                            {item.Medicine?.BrandName || "N/A"}
                          </td>
                          <td className="px-4 py-2 border">
                            {item.Medicine?.Generic?.GenericName || "N/A"}
                          </td>
                          <td className="px-4 py-2 border">
                            {item.Medicine?.Power || "N/A"}
                          </td>
                          <td className="px-4 py-2 border">{item.Quantity}</td>
                          <td className="px-4 py-2 border">
                            {selectedPrescription?.Status === "unsettled" ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={handleApprove}
                                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={handleReject}
                                  className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-700"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-500 text-sm italic">
                                Already Approved
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No items in cart.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No prescription selected.</p>
        )}
      </div>
    </div>
  );
};

export default CustomModal;
