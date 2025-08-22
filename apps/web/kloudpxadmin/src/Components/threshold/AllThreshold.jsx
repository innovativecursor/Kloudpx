"use client";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useThresholdContext } from "../../contexts/ThresholdContext";

const AllThreshold = () => {
  const { regions, loading, setEditingRegion } = useThresholdContext();
  const navigate = useNavigate();

  const handleEdit = (region) => {
    setEditingRegion(region);
    navigate("/updatethreshold");
  };

  return (
    <div className="mt-16  mb-32 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl border border-gray-200 p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          All Region Thresholds
        </h2>

        {loading ? (
          <p className="text-gray-500 text-center py-10">Loading...</p>
        ) : regions.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No region settings found.
          </p>
        ) : (
          <div className="overflow-x-auto cursor-pointer rounded-xl">
            <table className="min-w-full border-collapse">
              <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-gray-700">
                <tr>
                  <th className="border px-5 py-3 text-left">Region Name</th>
                  <th className="border px-5 py-3 text-left">ZIP Start</th>
                  <th className="border px-5 py-3 text-left">ZIP End</th>
                  <th className="border px-5 py-3 text-left">Delivery Time</th>
                  <th className="border px-5 py-3 text-left">Free Shipping Limit</th>
                  <th className="border px-5 py-3 text-left">Standard Rate</th>
                  <th className="border px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {regions.map((region) => (
                  <tr
                    key={region.ID || region.RegionName}
                    className="hover:bg-blue-50 transition"
                  >
                    <td className="border px-5 py-3 font-medium text-gray-800">
                      {region.RegionName}
                    </td>
                    <td className="border px-5 py-3">{region.ZipStart}</td>
                    <td className="border px-5 py-3">{region.ZipEnd}</td>
                    <td className="border px-5 py-3">{region.DeliveryTime}</td>
                    <td className="border px-5 py-3">{region.FreeShippingLimit}</td>
                    <td className="border px-5 py-3">{region.StandardRate}</td>
                    <td className="border px-5 py-3 text-center">
                      <button
                        onClick={() => handleEdit(region)}
                        className="bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600 shadow-md transition"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllThreshold;
