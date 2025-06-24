import React from "react";
import Title from "../comman/Title";
import Button from "../comman/Button";
import FormSectionWrapper from "../formSectionWrapper/FormSectionWrapper";
import LabeledInput from "../labelInput/LabelInput";
import LabeledSelect from "../labeledSelect/LabeledSelect";

import MedicineFormInputs from "../medicine/MedicineFormInputs";
import PriceSection from "../medicine/PriceSection";
import ThresholdSection from "../medicine/ThresholdSection";
import PrescriptionSection from "../medicine/PrescriptionSection";

import useMedicineForm from "../../hooks/useMedicineForm";

const AddMedicine = () => {
  const {
    formData,
    handleChange,
    genericName,
    handleGenericChange,
    handleGenericCreate,
    genericOptions,
    genericError,
    category,
    handleCategoryChange,
    handleCategoryCreate,
    categoryOptions,
    categoryError,
    supplier,
    handleSupplierChange,
    handleSupplierCreate,
    supplierOptions,
    supplierError,
    unitType,
    handleUnitChange,
    unitOptions,
    showMeasurementValue,
    taxType,
    handleTaxTypeChange,
    taxTypeOptions,
    prescriptionRequired,
    handleSubmit,
    handleUpload,
    handleImageChange,
    images,
    previewUrls,
    message,
    id,
    uploadedImageIds,
  } = useMedicineForm();

  const createGenericOption = (inputValue) => ({
    label: inputValue,
    value: inputValue.toLowerCase().replace(/\s+/g, "-"),
  });

  const createCategoryOption = (inputValue) => ({
    label: inputValue,
    value: inputValue.toLowerCase().replace(/\s+/g, "-"),
  });

  const createSupplierOption = (inputValue) => ({
    label: inputValue,
    value: inputValue.toLowerCase().replace(/\s+/g, "-"),
  });

  return (
    <div className="flex justify-center items-center mb-20">
      <div className="responsive-mx card">
        <Title text={id ? "Update Items" : "Add Items"} />
        {genericError && <p className="text-red-500 mb-2">{genericError}</p>}
        {supplierError && <p className="text-red-500 mb-2">{supplierError}</p>}
        {categoryError && <p className="text-red-500 mb-2">{categoryError}</p>}
        <FormSectionWrapper onSubmit={handleSubmit}>
          <MedicineFormInputs
            {...{
              formData,
              handleChange,
              genericName,
              handleGenericChange,
              handleGenericCreate: (inputValue) =>
                handleGenericCreate(inputValue, createGenericOption),
              genericOptions,
              category,
              handleCategoryChange,
              handleCategoryCreate: (inputValue) =>
                handleCategoryCreate(inputValue, createCategoryOption),
              categoryOptions,
              unitType,
              handleUnitChange,
              unitOptions,
              showMeasurementValue,
            }}
          />

          <PriceSection {...{ formData, handleChange }} />

          <LabeledSelect
            label="Supplier"
            value={supplier}
            onChange={(val) => {
              handleSupplierChange(val);
              handleChange("supplier", val);
            }}
            onCreate={(inputValue) =>
              handleSupplierCreate(inputValue, createSupplierOption)
            }
            options={supplierOptions}
            disabled={!formData.cpPerPiece}
            placeholder="Select or create supplier"
          />

          <LabeledInput
            label="Supplier Discount (%)"
            type="number"
            step="0.01"
            value={formData.supplierDiscount}
            onChange={(e) => handleChange("supplierDiscount", e.target.value)}
            disabled={!supplier}
            placeholder="Enter supplier discount"
          />

          <ThresholdSection {...{ formData, handleChange, supplier }} />

          <PrescriptionSection
            {...{
              formData,
              handleChange,
              taxType,
              handleTaxTypeChange,
              taxTypeOptions,
              handleImageChange,
              handleUpload,
              images,
              previewUrls,
              message,
              id,
              uploadedImageIds,
              prescriptionRequired,
            }}
          />

          <div className="flex justify-center items-center cursor-pointer my-6">
            <Button
              className="w-72"
              text={id ? "Update Medicine" : "Add Medicine"}
              type="submit"
              disabled={!prescriptionRequired || uploadedImageIds.length === 0}
            />
          </div>
        </FormSectionWrapper>
      </div>
    </div>
  );
};

export default AddMedicine;
