"use client";
import React from "react";
import AsyncSelect from "react-select/async";
import { useCartContext } from "@/app/contexts/CartContext";

const Clinics = () => {
  const { allClinics, selectedClinicId, setSelectedClinicId } =
    useCartContext();

  const clinicOptions =
    allClinics?.map((clinic) => ({
      value: clinic.ID,
      label: (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{clinic.Name}</span>
          <span className="text-xs text-gray-500">
            {clinic.Region}, {clinic.Province}
          </span>
          <span className="text-xs text-gray-500">
            {clinic.Sector} | {clinic.Street}
          </span>
          <span className="text-xs text-gray-500">☎ {clinic.Telephone}</span>
        </div>
      ),
      searchName: clinic.Name.toLowerCase(),
    })) || [];

  const filterClinics = (inputValue) => {
    return clinicOptions.filter((i) =>
      i.searchName.includes(inputValue.toLowerCase())
    );
  };

  const loadOptions = (inputValue, callback) => {
    if (inputValue.length < 1) {
      callback([]);
      return;
    }
    setTimeout(() => {
      callback(filterClinics(inputValue));
    }, 400);
  };

  const handleSelect = (selectedOption) => {
    if (selectedOption) {
      setSelectedClinicId(selectedOption.value);
    } else {
      setSelectedClinicId(null);
    }
  };

  const selectedClinic = allClinics.find((c) => c.ID === selectedClinicId);

  return (
    <div className="my-6">
      <label className="block mb-2 text-sm font-semibold text-gray-700">
        Select Clinic
      </label>
      <AsyncSelect
        cacheOptions
        defaultOptions={[]}
        loadOptions={loadOptions}
        placeholder="🔍 Search clinic by name..."
        isClearable
        onChange={handleSelect}
        styles={{
          control: (provided, state) => ({
            ...provided,
            borderRadius: "0.75rem",
            borderColor: state.isFocused ? "#9CA3AF" : "#6B7280",
            boxShadow: state.isFocused ? "0 0 0 1px #0070BA" : "none",
            padding: "6px 8px",
            minHeight: "56px",
            cursor: "pointer",
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
              ? "#0070BA"
              : state.isFocused
              ? "#E0F2FE"
              : "white",
            color: state.isSelected ? "white" : "#111827",
            padding: "10px 14px",
            borderBottom: "1px solid #f3f4f6",
            cursor: "pointer",
          }),
          menu: (provided) => ({
            ...provided,
            borderRadius: "0.75rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            marginTop: "6px",
            padding: "4px 0",
            zIndex: 20,
          }),
        }}
        noOptionsMessage={() => "Please search data..."}
      />

      {selectedClinic && (
        <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
          <span className="font-semibold text-gray-800 text-sm">
            {selectedClinic.Name}
          </span>
          <p className="text-xs text-gray-500 mt-1">
            {selectedClinic.Region}, {selectedClinic.Province}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {selectedClinic.Sector} | {selectedClinic.Street}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            ☎ {selectedClinic.Telephone}
          </p>
        </div>
      )}
    </div>
  );
};

export default Clinics;