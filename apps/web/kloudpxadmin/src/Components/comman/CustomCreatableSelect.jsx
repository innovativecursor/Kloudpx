import React from "react";
import CreatableSelect from "react-select/creatable";

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
    />
  );
};

export default CustomCreatableSelect;
