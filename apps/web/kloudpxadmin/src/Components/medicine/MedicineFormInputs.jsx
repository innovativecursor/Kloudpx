import React from "react";
import * as FaIcons from "react-icons/fa";
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
  categoryIcon,
  handleCategoryIconChange,
  handleCategoryIconCreate,
  categoryIconOptions,
}) => {
  const formatOptionLabel = ({ label }) => {
    const Icon = FaIcons[label];
    return (
      <div className="flex items-center gap-2">
        {Icon ? <Icon /> : null}
        <span>{label}</span>
      </div>
    );
  };

  return (
    <>
      <div className="flex gap-4">
        <div className="w-full ">
          <LabeledInput
            label="Brand Name"
            value={formData.brandName}
            onChange={(e) => handleChange("brandName", e.target.value)}
            placeholder="Enter brand name"
          />
        </div>

        <div className="w-full">
          <LabeledInput
            label="Power"
            value={formData.power}
            onChange={(e) => handleChange("power", e.target.value)}
            placeholder="Enter power (e.g., 500mg)"
            disabled={!formData.brandName}
          />
        </div>
      </div>

      <div className="w-full">
        <LabeledInput
          label="Product Discount"
          value={formData.discount}
          onChange={(e) => handleChange("discount", e.target.value)}
          placeholder="Enter discount"
          disabled={!formData.power}
        />
      </div>

      <LabeledSelect
        label="Generic Name"
        value={genericName}
        onChange={(val) => {
          handleGenericChange(val);
          handleChange("genericName", val);
        }}
        onCreate={handleGenericCreate}
        options={genericOptions}
        disabled={!formData.discount}
        placeholder="Select or create generic name"
      />

      <LabeledInput
        label="Description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        disabled={!genericName}
        placeholder="Enter description"
        textarea
        // className="md:col-span-2"
        className="w-full bg-green-200"
      />

      <div className="flex gap-4">
        <div className="w-full">
          <LabeledSelect
            label="Category Icon"
            value={categoryIcon}
            onChange={handleCategoryIconChange}
            onCreate={handleCategoryIconCreate}
            options={categoryIconOptions}
            disabled={!formData.description}
            placeholder="Select or create category icon"
          />
        </div>
        <div className="w-full">
          <LabeledSelect
            label="Category"
            value={category}
            onChange={handleCategoryChange}
            onCreate={handleCategoryCreate}
            options={categoryOptions}
            disabled={!formData.description}
            placeholder="Select or create category"
          />
        </div>
      </div>
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
