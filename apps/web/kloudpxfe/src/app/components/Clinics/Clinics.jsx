"use client";
import React from "react";
import AsyncSelect from "react-select/async";
import { useDoctorClinicsContext } from "@/app/contexts/DoctorClinicsContext";

const Clinics = () => {
  const {
    allClinics,
    selectedClinicId,
    setSelectedClinicId,
    customHospital,
    setCustomHospital,
    handleCustomConfirm,
    setIsCustomConfirmed,
  } = useDoctorClinicsContext();

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
    if (inputValue.length < 3) {
      callback([]);
      return;
    }

    let filtered = filterClinics(inputValue);

    if (filtered.length === 0) {
      filtered = [
        {
          value: `custom-${inputValue}`,
          label: `➕  hospital: "${inputValue}"`,
          isCustom: true,
        },
      ];
    }

    setTimeout(() => {
      callback(filtered);
    }, 400);
  };

  const handleSelect = (selectedOption) => {
    if (selectedOption) {
      if (selectedOption.isCustom) {
        setCustomHospital(
          selectedOption.label
            .replace("➕ hospital: ", "")
            .replace(/"/g, "")
        );
        setSelectedClinicId(null);
        handleCustomConfirm();
      } else {
        setSelectedClinicId(selectedOption.value);
        setCustomHospital("");
        setIsCustomConfirmed(false);
      }
    } else {
      setSelectedClinicId(null);
    }
  };

  const handleInputChange = (inputValue, { action }) => {
    if (action === "input-change") {
      setCustomHospital(inputValue && inputValue.length >= 3 ? inputValue : "");
      if (inputValue && inputValue.length > 0) setSelectedClinicId(null);
    }
  };

  const selectedClinic = allClinics.find((c) => c.ID === selectedClinicId);

  return (
    <div className="my-6">
      <label className="block mb-2 text-sm font-semibold text-gray-700">
        Select Clinic/hospital
      </label>
      <AsyncSelect
        cacheOptions
        defaultOptions={[]}
        loadOptions={loadOptions}
        placeholder="🔍 Search clinic by name..."
        isClearable
        onChange={handleSelect}
        onInputChange={handleInputChange}
        styles={{
          control: (provided, state) => ({
            ...provided,
            borderRadius: "0.75rem",
            borderColor: state.isFocused ? "#9CA3AF" : "#6B7280",
            boxShadow: state.isFocused ? "0 0 0 1px #0070BA" : "none",
            padding: "6px 8px",
            minHeight: "66px",
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

      {!selectedClinic && customHospital && (
        <div className="mt-4 p-5 border border-dashed rounded-md text-sm text-gray-700">
          Hospital Name:{" "}
          <span className="font-semibold">{customHospital}</span>
        </div>
      )}
    </div>
  );
};

export default Clinics;
