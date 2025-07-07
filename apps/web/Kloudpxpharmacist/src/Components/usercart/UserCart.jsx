import React from "react";
import { usePrescriptionContext } from "../../contexts/PrescriptionContext";
import { useCartpresciContext } from "../../contexts/CartpresciContext";

const UserCart = ({ details }) => {
  const { prescriptionsCart, isCartUpdated } = usePrescriptionContext();
  const { submitPrescriptions } = useCartpresciContext();

  return (
    <div>
      {prescriptionsCart.data && prescriptionsCart.data.length > 0 && (
        <div className="mt-10 max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
            User's Cart
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Medicine Name
                  </th>
                  <th className="text-center px-6 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Updated At
                  </th>
                </tr>
              </thead>
              <tbody>
                {prescriptionsCart.data.map((item) => (
                  <tr
                    key={item.ID}
                    className="border-b border-gray-200 hover:bg-blue-50 transition"
                  >
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {item.Medicine?.BrandName || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-700">
                      {item.Quantity}
                    </td>
                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                      {new Date(item.CreatedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                      {item.UpdatedAt &&
                      item.UpdatedAt !== "0001-01-01T00:00:00Z"
                        ? new Date(item.UpdatedAt).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {details?.Status !== "fulfilled" && (
            <div className="flex justify-center mt-8">
              <button
                onClick={submitPrescriptions}
                disabled={!isCartUpdated}
                className={`inline-block px-10 py-3 rounded-md text-white font-semibold shadow-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isCartUpdated
                    ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCart;
