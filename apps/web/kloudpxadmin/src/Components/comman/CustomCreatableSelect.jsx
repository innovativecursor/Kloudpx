import React from "react";
import CreatableSelect from "react-select/creatable";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "44px",
    height: "44px",
    padding: "0 6px",
    borderRadius: "6px",
    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 2px #3b82f680" : "none",
    "&:hover": {
      borderColor: state.isFocused ? "#3b82f6" : "#9ca3af",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 6px",
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: "44px",
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "0.875rem",
    color: "#6b7280",
  }),
};

const CustomCreatableSelect = ({
  value,
  onChange,
  onCreateOption,
  options,
  isDisabled,
  placeholder,
}) => {
  return (
    <CreatableSelect
      isClearable
      value={value}
      onChange={onChange}
      onCreateOption={onCreateOption}
      options={options}
      isDisabled={isDisabled}
      placeholder={placeholder}
      classNamePrefix="react-select"
      styles={customStyles}
    />
  );
};

export default CustomCreatableSelect;
