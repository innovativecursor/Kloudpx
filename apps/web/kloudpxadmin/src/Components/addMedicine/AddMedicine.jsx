import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Title from "../comman/Title";
import Button from "../comman/Button";
import BooleanCheckbox from "../comman/BooleanCheckbox";
import CustomCreatableSelect from "../comman/CustomCreatableSelect";
import Input from "../comman/Input";
import { useAuthContext } from "../../contexts/AuthContext";
import useCreatableSelect from "../../hooks/useCreatableSelect";
import endpoints from "../../config/endpoints";

const AddMedicine = () => {
  const {
    genericOptions,
    genericError,
    fetchGenericOptions,
    createGenericOption,
    supplierOptions,
    supplierError,
    fetchSupplierOptions,
    createSupplierOption,
    token,
    prescriptionRequired,
    setPrescriptionRequired,
    medicines,
  } = useAuthContext();

  const { id } = useParams();
  const navigate = useNavigate();

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

  const {
    value: supplier,
    handleChange: handleSupplierChange,
    handleCreateOption: handleSupplierCreate,
  } = useCreatableSelect();

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
    fetchSupplierOptions();
  }, []);

  useEffect(() => {
    if (!id || !medicines.length) return;

    const med = medicines.find((m) => m.ID === Number(id));
    if (!med) {
      alert("Medicine not found");
      return;
    }

    setFormData({
      brandName: med.BrandName || "",
      description: med.Description || "",
      measurementValue: med.MeasurementUnitValue || "",
      piecesPerBox: med.NumberOfPiecesPerBox || "",
      spPerBox: med.SellingPricePerBox || "",
      spPerPiece: med.SellingPricePerPiece || "",
      cpPerBox: med.CostPricePerBox || "",
      cpPerPiece: med.CostPricePerPiece || "",
      category: med.Category || "",
      supplierDiscount: med.SupplierDiscount?.replace("%", "") || "",
      minThreshold: med.MinimumThreshold || "",
      maxThreshold: med.MaximumThreshold || "",
      leadTime: med.EstimatedLeadTimeDays || "",
    });

    handleGenericChange({
      value: med.Generic.ID,
      label: med.Generic.GenericName,
    });
    handleSupplierChange({
      value: med.Supplier.ID,
      label: med.Supplier.SupplierName,
    });
    handleUnitChangeLocal({
      value: med.UnitOfMeasurement,
      label: med.UnitOfMeasurement,
    });
    handleTaxTypeChange({ value: med.TaxType, label: med.TaxType });

    setPrescriptionRequired(med.Prescription);
    setShowMeasurementValue(med.UnitOfMeasurement === "per box");
  }, [id, medicines]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!genericName?.value || !supplier?.value || !unitType?.value) {
      alert("Please select Generic Name, Supplier, and Unit.");
      return;
    }

    if (!prescriptionRequired) {
      alert("Please check 'Prescription Required' to proceed.");
      return;
    }

    const payload = {
      brandname: formData.brandName,
      genericid: Number(genericName.value),
      supplierid: Number(supplier.value),
      supplierdiscount: `${formData.supplierDiscount}%`,
      description: formData.description,
      unitofmeasurement: unitType.value,
      ...(unitType.value === "per box" && {
        measurementunitvalue: parseFloat(formData.measurementValue),
      }),
      numberofpiecesperbox: parseInt(formData.piecesPerBox),
      sellingpriceperbox: parseFloat(formData.spPerBox),
      sellingpriceperpiece: parseFloat(formData.spPerPiece),
      costpriceperbox: parseFloat(formData.cpPerBox),
      costpriceperpiece: parseFloat(formData.cpPerPiece),
      category: formData.category,
      taxtype: taxType?.value || "GST",
      minimumthreshold: parseInt(formData.minThreshold),
      maximumthreshold: parseInt(formData.maxThreshold),
      estimatedleadtimedays: parseInt(formData.leadTime),
      prescription: prescriptionRequired,
    };
    console.log(payload);
    try {
      if (id) {
        await axios.put(endpoints.medicine.update(id), payload, {
          headers: { Authorization: `${token}` },
        });
        alert("Medicine updated successfully!");
      } else {
        await axios.post(endpoints.medicine.add, payload, {
          headers: { Authorization: `${token}` },
        });
        alert("Medicine added successfully!");
      }
      navigate("/allmedicine");
    } catch (err) {
      console.error("Error submitting:", err);
      alert("Failed to submit medicine data.");
    }
  };

  return (
    <div className="flex justify-center items-center mb-20">
      <div className="responsive-mx card">
        <Title text={id ? "Edit Medicine" : "Add Medicine"} />
        {genericError && <p className="text-red-500 mb-2">{genericError}</p>}
        {supplierError && <p className="text-red-500 mb-2">{supplierError}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 px-5">
            <Input
              label="Brand Name"
              value={formData.brandName}
              onChange={(e) => handleChange("brandName", e.target.value)}
              placeholder="Enter brand name"
            />

            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-gray-700">
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
              <Input
                label="Category"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                disabled={!formData.genericName}
                placeholder="Enter category"
              />
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="mb-1 font-semibold text-gray-700">
                Unit of Measurement
              </label>
              <CustomCreatableSelect
                value={unitType}
                onChange={handleUnitChange}
                options={unitOptions}
                isDisabled={!formData.category}
                placeholder="Select or create unit"
              />
            </div>
            <div className="flex flex-col md:col-span-2">
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
            </div>

            <div className="flex flex-col md:col-span-2">
              <Input
                label="Number of Pieces per Box"
                type="number"
                value={formData.piecesPerBox}
                onChange={(e) => handleChange("piecesPerBox", e.target.value)}
                disabled={!unitType}
                placeholder="Enter number of pieces per box"
              />
            </div>

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

            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-gray-700">
                Supplier
              </label>
              <CustomCreatableSelect
                value={supplier}
                onChange={(val) => {
                  handleSupplierChange(val);
                  handleChange("supplier", val);
                }}
                onCreateOption={(inputValue) =>
                  handleSupplierCreate(inputValue, createSupplierOption)
                }
                options={supplierOptions}
                isDisabled={!formData.cpPerPiece}
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
                  (key === "minThreshold" && !supplier) ||
                  (key === "maxThreshold" && !formData.minThreshold) ||
                  (key === "leadTime" && !formData.maxThreshold)
                }
                placeholder={`Enter ${label}`}
              />
            ))}

            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-gray-700">
                Tax Type
              </label>
              <CustomCreatableSelect
                value={taxType}
                onChange={(val) => {
                  handleTaxTypeChange(val);
                  handleChange("taxType", val);
                }}
                options={taxTypeOptions}
                isDisabled={!formData.leadTime}
                placeholder="Select or create tax type"
              />
            </div>
          </div>

          <BooleanCheckbox label="Prescription Required" />

          <div className="flex justify-center items-center cursor-pointer my-6">
            <Button
              className="w-72"
              text={id ? "Update Medicine" : "Add Medicine"}
              type="submit"
              disabled={!taxType}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;
