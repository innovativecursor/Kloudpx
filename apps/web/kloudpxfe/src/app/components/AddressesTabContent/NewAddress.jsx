"use client";
import React, { useRef, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { useCheckout } from "@/app/contexts/CheckoutContext";

const libraries = ["places"];

export default function NewAddress({ setShowAddForm }) {
  const { handleSubmit, handleChange, formData } = useCheckout();
  const autocompleteRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBPaQPcHOUo3rYBRZuWnx792DbiJFRNyoA",
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !autocompleteRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteRef.current,
      {
        componentRestrictions: { country: "ph" },
        fields: ["address_components", "geometry"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;

      let region = "",
        province = "",
        city = "",
        barangay = "",
        zipcode = "";

      place.address_components.forEach((component) => {
        const types = component.types;
        if (types.includes("administrative_area_level_1"))
          region = component.long_name;
        if (types.includes("administrative_area_level_2"))
          province = component.long_name;
        if (types.includes("locality")) city = component.long_name;
        if (types.includes("sublocality_level_1"))
          barangay = component.long_name;
        if (types.includes("postal_code")) zipcode = component.long_name;
      });

      handleChange({ target: { name: "region", value: region } });
      handleChange({ target: { name: "province", value: province } });
      handleChange({ target: { name: "city", value: city } });
      handleChange({ target: { name: "barangay", value: barangay } });
      handleChange({ target: { name: "zipcode", value: zipcode } });
    });
  }, [isLoaded]);

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(e);
    setShowAddForm(false);
  };

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans">
      <form
        onSubmit={onSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 md:p-8 w-full max-w-lg grid grid-cols-1 gap-5"
      >
        {/* Google Autocomplete */}
        <div>
          <label className="font-medium text-xs text-gray-700">
            Search Address
          </label>
          <input
            ref={autocompleteRef}
            type="text"
            placeholder="Start typing your address..."
            className="w-full border px-4 py-2 mt-1 rounded-lg text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Name of Residency */}

        {/* Region */}
        <div>
          <label className="font-medium text-xs text-gray-700">Region</label>
          <input
            type="text"
            name="region"
            value={formData.region}
            onChange={handleChange}
            placeholder="e.g., Central"
            className="w-full border px-4 py-2 mt-1 rounded-lg text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Province */}
        <div>
          <label className="font-medium text-xs text-gray-700">Province</label>
          <input
            type="text"
            name="province"
            required
            value={formData.province}
            onChange={handleChange}
            placeholder="e.g., Metro Province"
            className="w-full border px-4 py-2 mt-1 rounded-lg text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* City */}
        <div>
          <label className="font-medium text-xs text-gray-700">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g., Metro City"
            className="w-full border px-4 py-2 mt-1 rounded-lg text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Barangay */}
        <div>
          <label className="font-medium text-xs text-gray-700">Barangay</label>
          <input
            type="text"
            name="barangay"
            required
            value={formData.barangay}
            onChange={handleChange}
            placeholder="e.g., Office 1"
            className="w-full border px-4 py-2 mt-1 rounded-lg text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Zip Code */}
        <div>
          <label className="font-medium text-xs text-gray-700">Zip Code</label>
          <input
            type="text"
            name="zipcode"
            value={formData.zipcode}
            onChange={handleChange}
            className="w-full border px-4 py-2 mt-1 rounded-lg text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Name of Residency */}
        <div>
          <label className="font-medium text-xs text-gray-700">
            Name of Residency
          </label>
          <input
            type="text"
            name="nameresidency"
            value={formData.nameresidency}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 mt-1 rounded-lg text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="font-medium text-xs text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            name="phonenumber"
            value={formData.phonenumber || "+63"}
            onChange={handleChange}
            required
            placeholder="e.g., 09123456789"
            className="w-full border px-4 py-2 mt-1 rounded-lg text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Default Address Checkbox */}
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
          <label className="text-xs font-medium text-gray-700">
            Make this my default address
          </label>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-[#0070BA] text-white w-full py-2.5 text-xs rounded-full font-medium hover:bg-[#005c96] transition"
          >
            {formData.id ? "Update Address" : "Save & Proceed"}
          </button>
        </div>
      </form>
    </div>
  );
}
