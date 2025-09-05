"use client";
import React, { useRef, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { useCheckout } from "@/app/contexts/CheckoutContext";
import usePageLoader from "@/app/hooks/usePageLoader";

const libraries = ["places"];

export default function NewAddress() {
  const {
    handleSubmit,
    handleChange,
    formData,
    fetchAddresstype,
    addressType,
  } = useCheckout();
  const autocompleteRef = useRef(null);
  const { startLoader, stopLoader } = usePageLoader();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBPaQPcHOUo3rYBRZuWnx792DbiJFRNyoA",
    libraries,
  });

  useEffect(() => {
    if (!isLoaded) {
      startLoader();
    } else {
      stopLoader();
    }
  }, [isLoaded]);

  useEffect(() => {
    fetchAddresstype();
  }, []);

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
  };

  if (!isLoaded) return null;

  return (
    <div className="">
      <div className="w-full mt-12">
        {/* Address Type */}
        <div className="mb-6">
          <label className="font-semibold text-sm text-gray-700">
            Type of Address
          </label>
          <div className="flex flex-wrap gap-4 md:mt-2 mt-3">
            {addressType.map((type) => (
              <label
                key={type.ID}
                className="flex  items-center gap-2 text-sm bg-gray-100 px-4 py-2 rounded-full cursor-pointer hover:bg-blue-50 transition"
              >
                <input
                  type="checkbox"
                  name="address_type_id"
                  value={type.ID}
                  checked={formData.address_type_id === type.ID}
                  onChange={() =>
                    handleChange({
                      target: { name: "address_type_id", value: type.ID },
                    })
                  }
                  className="accent-blue-500 cursor-pointer"
                />
                {type.TypeName}
              </label>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-5">
          {/* Google Autocomplete */}
          <div>
            <label className="font-medium text-xs text-gray-700">
              Search Address
            </label>
            <input
              ref={autocompleteRef}
              type="text"
              placeholder="Start typing your address..."
              className="w-full border border-gray-300 px-4 py-3 mt-1 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>

          {/* Other Inputs */}
          {[
            {
              label: "Region",
              name: "region",
              required: true,
              placeholder: "Enter Your Region",
            },
            {
              label: "Province",
              name: "province",
              required: true,
              placeholder: "Enter Your Province",
            },
            {
              label: "City",
              name: "city",
              required: true,
              placeholder: "Enter Your City",
            },
            {
              label: "Barangay",
              name: "barangay",
              required: true,
              placeholder: "Enter Your Barangay",
            },
            {
              label: "Zip Code",
              name: "zipcode",
              required: true,
              placeholder: "Enter Your Zip Code",
            },
            {
              label: "Location",
              name: "nameresidency",
              required: true,
              placeholder: "House No., Building, Street, Landmark",
            },
            {
              label: "Phone Number",
              name: "phonenumber",
              required: true,
              placeholder: "Enter Your Active Mobile Number",
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="font-medium text-xs text-gray-700">
                {field.label}
              </label>
              <input
                type="text"
                name={field.name}
                value={
                  formData[field.name] ||
                  (field.name === "phonenumber" ? "" : "")
                }
                onChange={handleChange}
                required={field.required}
                placeholder={field.placeholder}
                className="w-full border border-gray-300 px-4 py-3 mt-1 rounded-lg text-sm placeholder:text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              />
            </div>
          ))}

          {/* Default Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isdefault"
              checked={formData.isdefault}
              onChange={(e) =>
                handleChange({
                  target: { name: "isdefault", value: e.target.checked },
                })
              }
              className="accent-blue-500 cursor-pointer"
            />
            <label className="text-xs font-medium text-gray-700">
              Make this my default address
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#0070ba] text-white py-3 mt-4 cursor-pointer text-sm rounded-full font-semibold  transition shadow-md"
          >
            {formData.id ? "Update Address" : "Save & Proceed"}
          </button>
        </form>
      </div>
    </div>
  );
}
