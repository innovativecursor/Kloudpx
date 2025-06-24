import React from "react";
import LabeledInput from "../labelInput/LabelInput";

const PriceSection = ({ formData, handleChange }) => {
  const priceFields = [
    ["spPerBox", "Selling Price (per box)"],
    ["spPerPiece", "Selling Price (per piece)"],
    ["cpPerBox", "Cost Price (per box)"],
    ["cpPerPiece", "Cost Price (per piece)"],
  ];

  return priceFields.map(([key, label]) => (
    <LabeledInput
      key={key}
      label={label}
      type="number"
      step="0.01"
      value={formData[key]}
      onChange={(e) => handleChange(key, e.target.value)}
      disabled={
        (key === "spPerBox" && !formData.piecesPerBox) ||
        (key === "spPerPiece" && !formData.spPerBox) ||
        (key === "cpPerBox" && !formData.spPerPiece) ||
        (key === "cpPerPiece" && !formData.cpPerBox)
      }
      placeholder={`Enter ${label}`}
    />
  ));
};

export default PriceSection;
