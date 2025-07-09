import React from "react";
import ImageUploader from "../imageUploader/ImageUploader";
import LabeledSelect from "../labeledSelect/LabeledSelect";
import BooleanCheckbox from "../comman/BooleanCheckbox";

const PrescriptionSection = ({
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
  setImages,
  uploadedImageIds,
  setUploadedImageIds,
  setPreviewUrls,
}) => {
  return (
    <>
      <LabeledSelect
        label="Tax Type"
        value={taxType}
        onChange={(val) => {
          handleTaxTypeChange(val);
          handleChange("taxType", val);
        }}
        options={taxTypeOptions}
        // disabled={!formData.leadTime}
        placeholder="Select or create tax type"
      />
      <ImageUploader
        handleImageChange={handleImageChange}
        handleUpload={handleUpload}
        images={images}
        previewUrls={previewUrls}
        message={message}
        id={id}
        disabled={images.length >= 5 }
        uploadedImageIds={uploadedImageIds}
        setUploadedImageIds={setUploadedImageIds}
        setPreviewUrls={setPreviewUrls}
        setImages={setImages}
      />
      <BooleanCheckbox
        label="Prescription Required"
        disabled={!taxType?.value}
      />
    </>
  );
};

export default PrescriptionSection;
