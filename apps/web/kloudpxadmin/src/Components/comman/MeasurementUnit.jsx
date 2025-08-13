import React from "react";
import CreatableSelect from "react-select/creatable";
import { useMeasurementContext } from "../../contexts/MeasurementContext";

const customStyles = {
  control: (base, state) => ({
    ...base,
    padding: "0px 8px",
    minHeight: "3.5rem",
    borderRadius: "0.5rem",
    borderColor: state.isFocused ? "#3b82f6" : "#6b7280",
    boxShadow: state.isFocused
      ? "0 0 0 2px #3b82f6"
      : "0 1px 2px rgba(0,0,0,0.05)",
    backgroundColor: "white",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: "#3b82f6",
    },
  }),
};

const MeasurementUnit = () => {
  const {
    measurementType,
    setMeasurementType,
    measurementTypeOptions,
    measurementValue,
    setMeasurementValue,
    piecesPerBox,
    setPiecesPerBox,
  } = useMeasurementContext();

  const handleTypeChange = (option) => {
    setMeasurementType(option);
    setMeasurementValue("");
    setPiecesPerBox("");
  };

  const handleCreateType = (inputValue) => {
    const newOption = { label: inputValue, value: inputValue.toLowerCase() };
    setMeasurementType(newOption);
  };

  return (
    <div className="space-y-4 mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Measurement Unit Type
      </label>
      <CreatableSelect
        isClearable
        value={measurementType}
        onChange={handleTypeChange}
        onCreateOption={handleCreateType}
        options={measurementTypeOptions}
        styles={customStyles}
        placeholder="Select or create type"
      />

      {measurementType?.value === "per box" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Measurement Unit Value (Box)
            </label>
            <input
              type="text"
              className="w-full px-3 py-3.5 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={measurementValue}
              onChange={(e) => setMeasurementValue(e.target.value)}
              placeholder="Enter unit value"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Pieces per Box
            </label>
            <input
              type="number"
              min="1"
              className="w-full px-3 py-3.5 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={piecesPerBox}
              onChange={(e) => setPiecesPerBox(e.target.value)}
              placeholder="Enter pieces per box"
            />
          </div>
        </>
      )}

      <div className="my-10">
        {measurementType?.value === "per piece" && (
          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Measurement Unit Value (Piece)
            </label>
            <input
              type="text"
              className="w-full px-3 py-3.5 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={measurementValue}
              onChange={(e) => setMeasurementValue(e.target.value)}
              placeholder="Enter unit value"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MeasurementUnit;
