import React from "react";
import CreatableSelect from "react-select/creatable";

import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as TbIcons from "react-icons/tb";
import * as MdIcons from "react-icons/md";
import * as BiIcons from "react-icons/bi";
import * as GiIcons from "react-icons/gi";

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

const getIconComponent = (iconName) => {
  if (!iconName) return null;
  const prefix = iconName.substring(0, 2);

  switch (prefix) {
    case "Fa":
      return FaIcons[iconName] || null;
    case "Ai":
      return AiIcons[iconName] || null;
    case "Tb":
      return TbIcons[iconName] || null;
    case "Md":
      return MdIcons[iconName] || null;
    case "Bi":
      return BiIcons[iconName] || null;
    case "Gi":
      return GiIcons[iconName] || null;
    default:
      return null;
  }
};

const CustomCreatableSelect = ({
  value,
  onChange,
  onCreateOption,
  options,
  isDisabled,
  placeholder,
}) => {
  const formatOptionLabel = ({ label }) => {
    const IconComponent = getIconComponent(label);

    if (IconComponent) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "start",
            justifyContent: "start",
          }}
        >
          <IconComponent />
        </div>
      );
    } else {
      return <span>{label}</span>;
    }
  };

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
      formatOptionLabel={formatOptionLabel}
    />
  );
};

export default CustomCreatableSelect;
