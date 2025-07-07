import React from "react";
import LabeledInput from "../labelInput/LabelInput";

const PriceSection = ({ formData, handleChange }) => {
  return (
    <>
      {/* Selling Price row */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <LabeledInput
            label="Selling Price (per box)"
            type="number"
            step="0.01"
            value={formData.spPerBox}
            onChange={(e) => handleChange("spPerBox", e.target.value)}
            disabled={!formData.piecesPerBox}
            placeholder="Enter Selling Price (per box)"
          />
        </div>

        <div className="flex-1">
          <LabeledInput
            label="Selling Price (per piece)"
            type="number"
            step="0.01"
            value={formData.spPerPiece}
            onChange={(e) => handleChange("spPerPiece", e.target.value)}
            disabled={!formData.spPerBox}
            placeholder="Enter Selling Price (per piece)"
          />
        </div>
      </div>

      {/* Cost Price row */}
      <div className="flex gap-4">
        <div className="flex-1">
          <LabeledInput
            label="Cost Price (per box)"
            type="number"
            step="0.01"
            value={formData.cpPerBox}
            onChange={(e) => handleChange("cpPerBox", e.target.value)}
            disabled={!formData.spPerPiece}
            placeholder="Enter Cost Price (per box)"
          />
        </div>

        <div className="flex-1">
          <LabeledInput
            label="Cost Price (per piece)"
            type="number"
            step="0.01"
            value={formData.cpPerPiece}
            onChange={(e) => handleChange("cpPerPiece", e.target.value)}
            disabled={!formData.cpPerBox}
            placeholder="Enter Cost Price (per piece)"
          />
        </div>
      </div>
    </>
  );
};

export default PriceSection;
