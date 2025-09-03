"use client";
import React from "react";
import AsyncSelect from "react-select/async";
import { useDoctorClinicsContext } from "@/app/contexts/DoctorClinicsContext";

const Doctors = () => {
  const { allDoctors, selectedDoctorId, setSelectedDoctorId } =
    useDoctorClinicsContext();

  const doctorOptions =
    allDoctors?.map((doc) => ({
      value: doc.ID,
      doc,
      searchName: `${doc.FirstName} ${doc.LastName}`.toLowerCase(),
    })) || [];

  const filterDoctors = (inputValue) => {
    return doctorOptions.filter((i) =>
      i.searchName.includes(inputValue.toLowerCase())
    );
  };

  const loadOptions = (inputValue, callback) => {
    if (inputValue.length < 3) {
      callback([]);
      return;
    }
    setTimeout(() => {
      callback(filterDoctors(inputValue));
    }, 400);
  };

  const handleSelect = (selectedOption) => {
    if (selectedOption) {
      setSelectedDoctorId(selectedOption.value);
    } else {
      setSelectedDoctorId(null);
    }
  };

  const selectedDoctor = allDoctors.find((d) => d.ID === selectedDoctorId);

  return (
    <div className="my-6">
      <label className="block mb-2 text-sm font-semibold text-gray-700">
        Select Doctor
      </label>
      <AsyncSelect
        cacheOptions
        defaultOptions={[]}
        loadOptions={loadOptions}
        placeholder="🔍 Search doctor by first name..."
        isClearable
        onChange={handleSelect}
        getOptionLabel={(option) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800">
              {option.doc.FirstName} {option.doc.MiddleName}{" "}
              {option.doc.LastName}
            </span>
            <span className="text-xs text-gray-500">
              {option.doc.Municipality}, {option.doc.Province}
            </span>
            <span className="text-xs text-gray-500 italic">
              🩺 {option.doc.Specialty}
            </span>
          </div>
        )}
        getOptionValue={(option) => option.value}
        formatOptionLabel={(option, { context }) => {
          if (context === "menu") {
            return (
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">
                  {option.doc.FirstName} {option.doc.MiddleName}{" "}
                  {option.doc.LastName}
                </span>
                <span className="text-xs text-gray-500">
                  {option.doc.Municipality}, {option.doc.Province}
                </span>
                <span className="text-xs text-gray-500 italic">
                  🩺 {option.doc.Specialty}
                </span>
              </div>
            );
          }

          return (
            <span className="font-semibold text-gray-800">
              {option.doc.FirstName} {option.doc.MiddleName}{" "}
              {option.doc.LastName}
            </span>
          );
        }}
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

      {selectedDoctor && (
        <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
          <span className="font-semibold text-gray-800 text-sm">
            {selectedDoctor.FirstName} {selectedDoctor.MiddleName}{" "}
            {selectedDoctor.LastName}
          </span>
          <p className="text-xs text-gray-500 mt-1">
            {selectedDoctor.Municipality}, {selectedDoctor.Province}
          </p>
          <p className="text-xs text-gray-500 italic mt-1">
            🩺 {selectedDoctor.Specialty}
          </p>
        </div>
      )}
    </div>
  );
};

export default Doctors;
