import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";

const defaultOptions = [
  { value: "vat", label: "VAT" },
  { value: "non-vat", label: "Non-VAT" },
];

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
  valueContainer: (base) => ({
    ...base,
    padding: "0 4px",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 20,
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    overflow: "hidden",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#eff6ff" : "white",
    color: "#111827",
    padding: "10px 12px",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#111827",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
  }),
};

const TaxSelect = ({ value, onChange }) => {
  const [options, setOptions] = useState(defaultOptions);

  const handleCreate = (inputValue) => {
    const newOption = {
      value: inputValue.toLowerCase().replace(/\s+/g, "-"),
      label: inputValue,
    };
    setOptions((prev) => [...prev, newOption]);
    onChange(newOption);
  };

  return (
    <div className="">
      <label className="block font-medium mb-1 text-gray-700 text-sm">
        Tax
      </label>
      <CreatableSelect
        isClearable
        onChange={onChange}
        onCreateOption={handleCreate}
        options={options}
        value={value}
        placeholder="Select or create tax type"
        styles={customStyles}
      />
    </div>
  );
};

export default TaxSelect;
