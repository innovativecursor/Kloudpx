import React, { useEffect } from "react";
import { usePrescriptionContext } from "../contexts/PrescriptionContext";
import { useNavigate } from "react-router-dom";

const Prescription = () => {
  const { getAllSeniorCitizen, allPrescription, getSinglePrescriptionData } =
    usePrescriptionContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!allPrescription || allPrescription.length === 0) {
      getAllSeniorCitizen();
    }
  }, []);

  const handleClick = async (id) => {
    await getSinglePrescriptionData(id);
    navigate(`/prescriptiondetails/${id}`);
  };

  return (
    <div className=" md:p-6 mt-16 mx-[4vw]">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-[#0070ba] mb-6">
        All Prescriptions
      </h1>

      <div className="overflow-x-auto shadow-lg rounded-2xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-[#0070ba] text-white">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">User ID</th>
              <th className="px-6 py-3 text-left font-semibold">Name</th>
              <th className="px-6 py-3 text-left font-semibold">Email</th>
              <th className="px-6 py-3 text-center font-semibold">
                Pending Prescription
              </th>
              <th className="px-6 py-3 text-center font-semibold">
                Past Prescription
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {allPrescription && allPrescription.length > 0 ? (
              allPrescription.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => handleClick(item.userid)}
                  className="hover:bg-blue-50 transition duration-200 cursor-pointer"
                >
                  <td className="px-6 py-4">{item.userid}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.email}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.pendingprescription > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.pendingprescription}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.pastprescription > 0
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.pastprescription}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No prescriptions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Prescription;
