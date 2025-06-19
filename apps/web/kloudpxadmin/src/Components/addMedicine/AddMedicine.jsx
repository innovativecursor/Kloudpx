import React, { useState, useEffect } from "react";
import Title from "../comman/Title";
import Button from "../comman/Button";
import BooleanCheckbox from "../comman/BooleanCheckbox";
import CustomCreatableSelect from "../comman/CustomCreatableSelect";
import Input from "../comman/Input";
import { useAuthContext } from "../../contexts/AuthContext";
import useCreatableSelect from "../../hooks/useCreatableSelect";

const AddMedicine = () => {
  const {
    genericOptions,
    genericError,
    fetchGenericOptions,
    createGenericOption,
  } = useAuthContext();

  const [formData, setFormData] = useState({
    brandName: "",
    description: "",
    measurementValue: "",
    piecesPerBox: "",
    spPerBox: "",
    spPerPiece: "",
    cpPerBox: "",
    cpPerPiece: "",
    category: "",
    supplierDiscount: "",
    minThreshold: "",
    maxThreshold: "",
    leadTime: "",
  });

  const [showMeasurementValue, setShowMeasurementValue] = useState(false);

  const taxTypeOptions = [
    { value: "GST 5%", label: "GST 5%" },
    { value: "GST 12%", label: "GST 12%" },
    { value: "GST 18%", label: "GST 18%" },

  ];

  const supplierOptions = [
    { value: "Supplier A", label: "Supplier A" },
    { value: "Supplier B", label: "Supplier B" },
  ];

  const unitOptions = [
    { value: "per box", label: "per box" },
    { value: "per piece", label: "per piece" },
  ];

  const {
    value: genericName,
    handleChange: handleGenericChange,
    handleCreateOption: handleGenericCreate,
  } = useCreatableSelect();

  const { value: unitType, handleChange: handleUnitChangeLocal } =
    useCreatableSelect();

  const { value: supplier, handleChange: handleSupplierChange } =
    useCreatableSelect();

  const { value: taxType, handleChange: handleTaxTypeChange } =
    useCreatableSelect();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUnitChange = (val) => {
    handleUnitChangeLocal(val);
    handleChange("unitType", val);
    setShowMeasurementValue(val?.value === "per box");
  };

  useEffect(() => {
    fetchGenericOptions();
  }, []);

  useEffect(() => {
    const { spPerBox, measurementValue } = formData;
    if (
      spPerBox &&
      measurementValue &&
      !isNaN(spPerBox) &&
      !isNaN(measurementValue)
    ) {
      const perPiece = parseFloat(spPerBox) / parseFloat(measurementValue);
      setFormData((prev) => ({ ...prev, spPerPiece: perPiece.toFixed(2) }));
    }
  }, [formData.spPerBox, formData.measurementValue]);

  return (
    <div className="flex justify-center items-center mb-20">
      <div className="responsive-mx card">
        <Title text="Add Medicine" />
        {genericError && <p className="text-red-500 mb-4">{genericError}</p>}
        <form>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 px-5">
            <Input
              label="Brand Name"
              value={formData.brandName}
              onChange={(e) => handleChange("brandName", e.target.value)}
              placeholder="Enter brand name"
            />

            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">
                Generic Name
              </label>
              <CustomCreatableSelect
                value={genericName}
                onChange={(val) => {
                  handleGenericChange(val);
                  handleChange("genericName", val);
                }}
                onCreateOption={(inputValue) =>
                  handleGenericCreate(inputValue, createGenericOption)
                }
                options={genericOptions}
                isDisabled={!formData.brandName}
                placeholder="Select or create generic name"
              />
            </div>

            <div className="flex flex-col md:col-span-2">
              <Input
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                disabled={!genericName}
                placeholder="Enter description"
                textarea
              />
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="mb-2 font-semibold text-gray-700">
                Unit of Measurement
              </label>
              <CustomCreatableSelect
                value={unitType}
                onChange={handleUnitChange}
                options={unitOptions}
                isDisabled={!formData.description}
                placeholder="Select or create unit"
              />
            </div>

            {showMeasurementValue && (
              <Input
                label="Measurement Unit Value"
                type="number"
                step="0.01"
                value={formData.measurementValue}
                onChange={(e) =>
                  handleChange("measurementValue", e.target.value)
                }
                placeholder="Enter measurement value"
              />
            )}

            <Input
              label="Number of Pieces per Box"
              type="number"
              value={formData.piecesPerBox}
              onChange={(e) => handleChange("piecesPerBox", e.target.value)}
              disabled={!unitType}
              placeholder="Enter number of pieces per box"
            />

            {[
              ["spPerBox", "Selling Price (per box)"],
              ["spPerPiece", "Selling Price (per piece)"],
              ["cpPerBox", "Cost Price (per box)"],
              ["cpPerPiece", "Cost Price (per piece)"],
            ].map(([key, label]) => (
              <Input
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
            ))}

            <Input
              label="Category"
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              disabled={!formData.cpPerPiece}
              placeholder="Enter category"
            />

            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">
                Supplier
              </label>
              <CustomCreatableSelect
                value={supplier}
                onChange={(val) => {
                  handleSupplierChange(val);
                  handleChange("supplier", val);
                }}
                options={supplierOptions}
                isDisabled={!formData.category}
                placeholder="Select or create supplier"
              />
            </div>

            <Input
              label="Supplier Discount (%)"
              type="number"
              step="0.01"
              value={formData.supplierDiscount}
              onChange={(e) => handleChange("supplierDiscount", e.target.value)}
              disabled={!supplier}
              placeholder="Enter supplier discount"
            />

            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">
                Tax Type
              </label>
              <CustomCreatableSelect
                value={taxType}
                onChange={(val) => {
                  handleTaxTypeChange(val);
                  handleChange("taxType", val);
                }}
                options={taxTypeOptions}
                isDisabled={!supplier}
                placeholder="Select or create tax type"
              />
            </div>

            {[
              ["minThreshold", "Minimum Threshold"],
              ["maxThreshold", "Maximum Threshold"],
              ["leadTime", "Estimated Lead Time (days)"],
            ].map(([key, label]) => (
              <Input
                key={key}
                label={label}
                type="number"
                value={formData[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                disabled={
                  (key === "minThreshold" && !taxType) ||
                  (key === "maxThreshold" && !formData.minThreshold) ||
                  (key === "leadTime" && !formData.maxThreshold)
                }
                placeholder={`Enter ${label}`}
              />
            ))}
          </div>

          <BooleanCheckbox label="Prescription Required" />

          <div className="flex justify-center items-center cursor-pointer my-6">
            <Button
              className="w-72"
              text="Submit"
              disabled={!formData.leadTime}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;













