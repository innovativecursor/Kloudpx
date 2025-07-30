"use client";
import React from "react";
import { useCheckout } from "@/app/contexts/CheckoutContext";

const NewAddress = () => {
  const { handleSubmit, handleChange, formData, selectedAddress } =
    useCheckout();

  return (
    <div>
      <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-5">
        {/* nameresidency */}
        <div>
          <label className="font-medium text-xs dark-text">
            Name of Residency
          </label>
          <input
            type="text"
            name="nameresidency"
            value={formData.nameresidency}
            onChange={handleChange}
            placeholder="e.g., Office 1"
            className="w-full border-2 px-4 py-2 mt-1 rounded-lg text-xs border-gray-300"
          />
        </div>

        {/* region */}
        <div>
          <label className="font-medium text-xs dark-text">Region</label>
          <input
            type="text"
            name="region"
            value={formData.region}
            onChange={handleChange}
            placeholder="e.g., Central"
            className="w-full border-2 px-4 py-2 mt-1 rounded-lg text-xs border-gray-300"
          />
        </div>

        <div>
          <label className="font-medium text-xs dark-text">Province</label>
          <input
            type="text"
            name="province"
            value={formData.province}
            onChange={handleChange}
            placeholder="e.g., Metro Province"
            className="w-full border-2 px-4 py-2 mt-1 rounded-lg text-xs border-gray-300"
          />
        </div>

        <div>
          <label className="font-medium text-xs dark-text">Barangay</label>
          <input
            type="text"
            name="barangay"
            value={formData.barangay}
            onChange={handleChange}
            placeholder="e.g., Office 1"
            className="w-full border-2 px-4 py-2 mt-1 rounded-lg text-xs border-gray-300"
          />
        </div>

        {/* city */}
        <div>
          <label className="font-medium text-xs dark-text">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g., Metro City"
            className="w-full border-2 px-4 py-2 mt-1 rounded-lg text-xs border-gray-300"
          />
        </div>

        {/* zipcode */}
        <div>
          <label className="font-medium text-xs dark-text">Zip Code</label>
          <input
            type="text"
            name="zipcode"
            value={formData.zipcode}
            onChange={handleChange}
            placeholder="e.g., 1000"
            className="w-full border-2 px-4 py-2 mt-1 rounded-lg text-xs border-gray-300"
          />
        </div>

        {/* isdefault */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isdefault"
            checked={formData.isdefault}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "isdefault",
                  value: e.target.checked,
                },
              })
            }
          />
          <label className="text-xs font-medium">
            Make this my default address
          </label>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="bg-[#0070BA] text-white cursor-pointer w-full py-2.5 text-[10px] rounded-full font-medium hover:bg-[#005c96]"
          >
            {formData.id ? "Update Address" : "Save & Proceed"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewAddress;
