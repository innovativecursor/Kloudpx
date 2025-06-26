import React from "react";
import CommonButton from "../../Components/button/CommanButton";
import { Link } from "react-router-dom";

const AllPrescription = ({ loading, prescriptions, handleClick }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <CommonButton
            onClick={() => handleClick("fulfilled")}
            disabled={loading}
          >
            Past Prescription
          </CommonButton>
          <CommonButton
            onClick={() => handleClick("unsettled")}
            disabled={loading}
          >
            Unsettled Prescription
          </CommonButton>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-20">
        {Array.isArray(prescriptions.data) && prescriptions.data.length > 0 ? (
          prescriptions.data.map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow border border-gray-200"
            >
              <Link to={`/prescription-details/${item.ID}`}>
                <img
                  src={item.UploadedImage}
                  alt="Prescription"
                  className="w-full h-60 object-cover rounded mb-3 cursor-pointer"
                />
              </Link>
              <p className="text-sm">
                <span className="font-semibold">User:</span>{" "}
                {item?.User?.FirstName} {item?.User?.LastName}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Email:</span>{" "}
                {item?.User?.Email}
              </p>
            </div>
          ))
        ) : loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <p className="text-gray-500">No prescriptions found.</p>
        )}
      </div>
    </div>
  );
};

export default AllPrescription;
