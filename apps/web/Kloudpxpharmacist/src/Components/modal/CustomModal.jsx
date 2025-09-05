import React, { useEffect, useRef } from "react";
import { usePrescriptionContext } from "../../contexts/PrescriptionContext";
import Swal from "sweetalert2";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const CustomModal = ({ isOpen, onClose, selectedPrescription, activeTab }) => {
  const {
    fetchPrescriptionCartById,
    prescriptionCart,
    approvePrescription,
    fetchPrescriptionsDetails,
    fetchAllPrescriptions,
    rejectPrescription,
  } = usePrescriptionContext();

  const modalRef = useRef();

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen && selectedPrescription?.ID) {
      fetchPrescriptionCartById(selectedPrescription.ID);
    }
  }, [isOpen, selectedPrescription]);

  const handleApprove = async (cartid) => {
    if (!cartid) return;

    const res = await approvePrescription(cartid);

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

      // onClose();
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to approve prescription.",
      });
    }
  };

  const handleReject = async (cartid) => {
    if (!cartid) return;

    const res = await rejectPrescription(cartid);

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

      // onClose();
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to reject prescription.",
      });
    }
  };

  useEffect(() => {
    if (
      activeTab === "unsettled" &&
      prescriptionCart &&
      prescriptionCart.length > 0 &&
      prescriptionCart.every(
        (item) =>
          item.MedicineStatus === "approved" ||
          item.MedicineStatus === "rejected"
      )
    ) {
      onClose();
    }
  }, [prescriptionCart, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 cursor-pointer bg-black bg-opacity-50 flex justify-center items-center px-4"
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]"
      >
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
              <Zoom>
                <img
                  src={selectedPrescription.UploadedImage}
                  alt="Prescription"
                  className="w-full h-64 object-contain rounded-lg border cursor-pointer"
                />
              </Zoom>
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
              prescriptionCart?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-center cursor-pointer border">
                    <thead className="bg-[#0070ba] text-white   font-semibold">
                      <tr>
                        <th className="px-4 py-3 border">Category</th>
                        <th className="px-4 py-3 border">Brand</th>
                        <th className="px-4 py-3 border">Generic</th>
                        <th className="px-4 py-3 border">Power</th>
                        <th className="px-4 py-3 border">Quantity</th>
                        <th className="px-4 py-3 border">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptionCart.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 border">
                            {item.Medicine?.Category?.CategoryName || "N/A"}
                          </td>
                          <td className="px-4 py-3 border">
                            {item.Medicine?.BrandName || "N/A"}
                          </td>
                          <td className="px-4 py-3 border">
                            {item.Medicine?.Generic?.GenericName || "N/A"}
                          </td>
                          <td className="px-4 py-3 border">
                            {item.Medicine?.Power || "N/A"}
                          </td>
                          <td className="px-4 py-3 border">{item.Quantity}</td>
                          <td className="px-4 py-3 border">
                            {activeTab === "unsettled" ? (
                              item.MedicineStatus === "unsettled" ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleApprove(item.ID)}
                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleReject(item.ID)}
                                    className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-700"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span
                                  className={
                                    item.MedicineStatus === "approved"
                                      ? "text-green-600 font-semibold"
                                      : "text-red-500 font-semibold"
                                  }
                                >
                                  {`Already ${
                                    item.MedicineStatus.charAt(
                                      0
                                    ).toUpperCase() +
                                    item.MedicineStatus.slice(1)
                                  }`}
                                </span>
                              )
                            ) : (
                              <span
                                className={`text-xs font-medium px-5 py-1 rounded-full ${
                                  item?.MedicineStatus?.toLowerCase() ===
                                  "approved"
                                    ? "bg-green-100 text-green-600 border border-green-300"
                                    : "bg-red-100 text-red-600 border border-red-300"
                                }`}
                              >
                                {/* {item?.MedicineStatus} */}
                                {item?.MedicineStatus
                                  ? item.MedicineStatus.charAt(
                                      0
                                    ).toUpperCase() +
                                    item.MedicineStatus.slice(1).toLowerCase()
                                  : ""}
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
