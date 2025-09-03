"use client";
import React, { useState, useEffect } from "react";
import { useThresholdContext } from "../../contexts/ThresholdContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditThreshold = () => {
  const { addOrUpdateRegion, editingRegion, setEditingRegion } =
    useThresholdContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    region_name: "",
    zip_start: "",
    zip_end: "",
    delivery_time: "",
    free_shipping_limit: "",
    standard_rate: "",
  });

  useEffect(() => {
    if (editingRegion) {
      setFormData({
        region_name: editingRegion.RegionName,
        zip_start: editingRegion.ZipStart,
        zip_end: editingRegion.ZipEnd,
        delivery_time: editingRegion.DeliveryTime,
        free_shipping_limit: editingRegion.FreeShippingLimit,
        standard_rate: editingRegion.StandardRate,
      });
    }
  }, [editingRegion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingRegion?.ID) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Only existing regions can be edited. Please select a region first.",
      });
      return;
    }

    const payload = {
      id: editingRegion.ID,
      region_name: formData.region_name,
      zip_start: Number(formData.zip_start),
      zip_end: Number(formData.zip_end),
      delivery_time: formData.delivery_time,
      free_shipping_limit: Number(formData.free_shipping_limit),
      standard_rate: Number(formData.standard_rate),
    };

    await addOrUpdateRegion(payload);
    setEditingRegion(null);
    navigate("/allthreshold");
  };

  if (!editingRegion) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-10 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            No Region Selected
          </h2>
          <p className="text-gray-600 mb-6">
            Please go to{" "}
            <span className="font-semibold text-[#0070ba]">All Thresholds</span>{" "}
            and select a region to edit.
          </p>
          <button
            onClick={() => navigate("/allthreshold")}
            className="bg-[#0070ba] text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform shadow-md"
          >
            Go to All Thresholds
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="md:p-4 mt-16 mx-[4vw] flex justify-center mb-32">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Edit Region Threshold
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Region Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Region Name
            </label>
            <input
              type="text"
              name="region_name"
              value={formData.region_name}
              onChange={handleChange}
              placeholder="Enter Region Name"
              className="w-full outline-none p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              required
            />
          </div>

          {/* ZIP Start & ZIP End */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                ZIP Start
              </label>
              <input
                type="number"
                name="zip_start"
                value={formData.zip_start}
                onChange={handleChange}
                placeholder="Start ZIP"
                className="w-full p-4 outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                ZIP End
              </label>
              <input
                type="number"
                name="zip_end"
                value={formData.zip_end}
                onChange={handleChange}
                placeholder="End ZIP"
                className="w-full p-4 outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                required
              />
            </div>
          </div>

          {/* Delivery Time */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Delivery Time
            </label>
            <input
              type="text"
              name="delivery_time"
              value={formData.delivery_time}
              onChange={handleChange}
              placeholder="E.g., 3-7 days"
              className="w-full p-4 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              required
            />
          </div>

          {/* Free Shipping Limit & Standard Rate */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Free Shipping Limit
              </label>
              <input
                type="number"
                name="free_shipping_limit"
                value={formData.free_shipping_limit}
                onChange={handleChange}
                placeholder="Free Shipping Limit"
                className="w-full p-4 outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Standard Rate
              </label>
              <input
                type="number"
                name="standard_rate"
                value={formData.standard_rate}
                onChange={handleChange}
                placeholder="Standard Rate"
                className="w-full p-4 outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#0070ba] text-white py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform shadow-lg"
          >
            Update Region
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditThreshold;
