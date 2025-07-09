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
import IsBrandItem from "./IsBrandItem";
import { useNavigate } from "react-router-dom";

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
    setImages,
    previewUrls,
    message,
    id,
    uploadedImageIds,
    setPreviewUrls,
    setUploadedImageIds,
    isBrand,
    setIsBrand,
    categoryIcons,
    handleCategoryIconChange,
    handleCategoryIconCreate,
    categoryIcon,
    categoryIconError,
    categoryIconOptions,
  } = useMedicineForm();
  const navigate = useNavigate();
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
    <div className="flex justify-center items-center mb-20 ">
      <div className="responsive-mx card">
        <Title text={id ? "Update Items" : "Add Items"} />

        {/* Error Messages */}
        {genericError && <p className="text-red-500 mb-2">{genericError}</p>}
        {supplierError && <p className="text-red-500 mb-2">{supplierError}</p>}
        {categoryError && <p className="text-red-500 mb-2">{categoryError}</p>}
        {categoryIconError && (
          <p className="text-red-500 mb-2">{categoryIconError}</p>
        )}

        <FormSectionWrapper onSubmit={handleSubmit}>
          <MedicineFormInputs
            formData={formData}
            handleChange={handleChange}
            genericName={genericName}
            handleGenericChange={handleGenericChange}
            handleGenericCreate={handleGenericCreate}
            genericOptions={genericOptions}
            categoryIcon={categoryIcon}
            handleCategoryIconChange={handleCategoryIconChange}
            handleCategoryIconCreate={handleCategoryIconCreate}
            categoryIconOptions={categoryIconOptions}
            category={category}
            handleCategoryChange={handleCategoryChange}
            handleCategoryCreate={handleCategoryCreate}
            categoryOptions={categoryOptions}
            unitType={unitType}
            handleUnitChange={handleUnitChange}
            unitOptions={unitOptions}
            showMeasurementValue={showMeasurementValue}
          />
          <IsBrandItem
            label="Mark as Branded Product"
            isBrand={isBrand}
            setIsBrand={setIsBrand}
          />

          {/* Price Section */}
          <PriceSection formData={formData} handleChange={handleChange} />

          <div className="flex gap-4">
            <div className="w-full">
              {/* Supplier Select */}
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
                // disabled={!formData.cpPerPiece}
                placeholder="Select or create supplier"
              />
            </div>
            <div className="w-full">
              {/* Supplier Discount Input */}
              <LabeledInput
                label="Supplier Discount (%)"
                type="number"
                step="0.01"
                value={formData.supplierDiscount}
                onChange={(e) =>
                  handleChange("supplierDiscount", e.target.value)
                }
                // disabled={!supplier}
                placeholder="Enter supplier discount"
              />
            </div>
          </div>
          {/* Threshold Section */}
          <ThresholdSection
            formData={formData}
            handleChange={handleChange}
            supplier={supplier}
          />

          {/* Prescription Section */}
          <PrescriptionSection
            formData={formData}
            handleChange={handleChange}
            taxType={taxType}
            handleTaxTypeChange={handleTaxTypeChange}
            taxTypeOptions={taxTypeOptions}
            handleImageChange={handleImageChange}
            handleUpload={handleUpload}
            images={images}
            previewUrls={previewUrls}
            message={message}
            id={id}
            uploadedImageIds={uploadedImageIds}
            setUploadedImageIds={setUploadedImageIds}
            setPreviewUrls={setPreviewUrls}
            prescriptionRequired={prescriptionRequired}
            setImages={setImages}
          />

          {/* Submit Button */}
          <div className="flex justify-center items-center gap-6 my-8 pb-8">
            <Button
              className="w-72"
              text={id ? "Update Medicine" : "Add Medicine"}
              type="submit"
              disabled={uploadedImageIds.length === 0}
            />
            <Button
              className="w-60 bg-red-400 hover:bg-red-500 text-white"
              text="Cancel"
              type="button"
              onClick={() => navigate(-1)}
            />
          </div>
        </FormSectionWrapper>
      </div>
    </div>
  );
};

export default AddMedicine;
