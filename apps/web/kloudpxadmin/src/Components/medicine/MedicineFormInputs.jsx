import React from "react";
import LabeledInput from "../labelInput/LabelInput";
import LabeledSelect from "../labeledSelect/LabeledSelect";

const MedicineFormInputs = ({
  formData,
  handleChange,
  genericName,
  handleGenericChange,
  handleGenericCreate,
  genericOptions,
  category,
  handleCategoryChange,
  handleCategoryCreate,
  categoryOptions,
  unitType,
  handleUnitChange,
  unitOptions,
  showMeasurementValue,
}) => {
  return (
    <>
      <LabeledInput
        label="Brand Name"
        value={formData.brandName}
        onChange={(e) => handleChange("brandName", e.target.value)}
        placeholder="Enter brand name"
      />

      <LabeledSelect
        label="Generic Name"
        value={genericName}
        onChange={(val) => {
          handleGenericChange(val);
          handleChange("genericName", val);
        }}
        onCreate={handleGenericCreate}
        options={genericOptions}
        disabled={!formData.brandName}
        placeholder="Select or create generic name"
      />

      <LabeledInput
        label="Description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        disabled={!genericName}
        placeholder="Enter description"
        textarea
        className="md:col-span-2"
      />

      <LabeledSelect
        label="Category"
        value={category}
        onChange={handleCategoryChange}
        onCreate={handleCategoryCreate}
        options={categoryOptions}
        disabled={!formData.description}
        placeholder="Select or create category"
      />

      <LabeledSelect
        label="Unit of Measurement"
        value={unitType}
        onChange={handleUnitChange}
        options={unitOptions}
        disabled={!category?.value}
        placeholder="Select or create unit"
      />

      {showMeasurementValue && (
        <LabeledInput
          label="Measurement Unit Value"
          type="number"
          step="0.01"
          value={formData.measurementValue}
          onChange={(e) => handleChange("measurementValue", e.target.value)}
          placeholder="Enter measurement value"
        />
      )}

      <LabeledInput
        label="Number of Pieces per Box"
        type="number"
        value={formData.piecesPerBox}
        onChange={(e) => handleChange("piecesPerBox", e.target.value)}
        disabled={!unitType}
        placeholder="Enter number of pieces per box"
      />
    </>
  );
};

export default MedicineFormInputs;
