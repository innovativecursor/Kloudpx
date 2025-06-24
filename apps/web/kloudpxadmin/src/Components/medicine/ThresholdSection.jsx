import React from "react";
import LabeledInput from "../labelInput/LabelInput";

const ThresholdSection = ({ formData, handleChange, supplier }) => {
  const thresholdFields = [
    ["minThreshold", "Minimum Threshold"],
    ["maxThreshold", "Maximum Threshold"],
    ["leadTime", "Estimated Lead Time (days)"],
  ];

  return thresholdFields.map(([key, label]) => (
    <LabeledInput
      key={key}
      label={label}
      type="number"
      value={formData[key]}
      onChange={(e) => handleChange(key, e.target.value)}
      disabled={
        (key === "minThreshold" && !supplier) ||
        (key === "maxThreshold" && !formData.minThreshold) ||
        (key === "leadTime" && !formData.maxThreshold)
      }
      placeholder={`Enter ${label}`}
    />
  ));
};

export default ThresholdSection;
