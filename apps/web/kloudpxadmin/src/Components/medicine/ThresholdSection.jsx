import React from "react";
import LabeledInput from "../labelInput/LabelInput";

const ThresholdSection = ({ formData, handleChange, supplier }) => {
  return (
    <>
      {/* Minimum & Maximum Threshold in one line */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <LabeledInput
            label="Minimum Threshold"
            type="number"
            value={formData.minThreshold}
            onChange={(e) => handleChange("minThreshold", e.target.value)}
            // disabled={!supplier}
            placeholder="Enter Minimum Threshold"
          />
        </div>

        <div className="flex-1">
          <LabeledInput
            label="Maximum Threshold"
            type="number"
            value={formData.maxThreshold}
            onChange={(e) => handleChange("maxThreshold", e.target.value)}
            // disabled={!formData.minThreshold}
            placeholder="Enter Maximum Threshold"
          />
        </div>
      </div>

      {/* Estimated Lead Time full width */}
      <LabeledInput
        label="Estimated Lead Time (days)"
        type="number"
        value={formData.leadTime}
        onChange={(e) => handleChange("leadTime", e.target.value)}
        // disabled={!formData.maxThreshold}
        placeholder="Enter Estimated Lead Time (days)"
      />
    </>
  );
};

export default ThresholdSection;
