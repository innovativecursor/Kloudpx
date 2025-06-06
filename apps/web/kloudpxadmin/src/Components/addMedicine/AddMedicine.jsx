import React, { useState, useEffect } from "react";
import Title from "../comman/Title";
import CreatableSelect from "react-select/creatable";

const AddMedicine = () => {
  const [formData, setFormData] = useState({
    brandName: "",
    genericName: null,
    description: "",
    unitType: null,
    measurementValue: "",
    piecesPerBox: "",
    spPerBox: "",
    spPerPiece: "",
    cpPerBox: "",
    cpPerPiece: "",
    category: "",
    supplier: null,
    taxType: null,
    minThreshold: "",
    maxThreshold: "",
    leadTime: ""
  });

  const [showMeasurementValue, setShowMeasurementValue] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const { spPerBox, measurementValue } = formData;
    if (spPerBox && measurementValue && !isNaN(spPerBox) && !isNaN(measurementValue)) {
      const perPiece = parseFloat(spPerBox) / parseFloat(measurementValue);
      setFormData(prev => ({ ...prev, spPerPiece: perPiece.toFixed(2) }));
    }
  }, [formData.spPerBox, formData.measurementValue]);

  const genericNameOptions = [
    { value: "Paracetamol", label: "Paracetamol" },
    { value: "Ibuprofen", label: "Ibuprofen" },
  ];

  const taxTypeOptions = [
    { value: "GST 5%", label: "GST 5%" },
    { value: "GST 12%", label: "GST 12%" },
  ];

  const supplierOptions = [
    { value: "Supplier A", label: "Supplier A" },
    { value: "Supplier B", label: "Supplier B" },
  ];

  const unitOptions = [
    { value: "per box", label: "per box" },
    { value: "per piece", label: "per piece" },
  ];

  const handleUnitChange = (newValue) => {
    handleChange("unitType", newValue);
    setShowMeasurementValue(newValue?.value === "per box");
  };

  return (
    <div className="flex justify-center items-center mb-20">
      <div className="responsive-mx card">
        <Title text="Add Medicine" />
        <form className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 px-5">

          {/* Row 1 */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Brand Name</label>
            <input type="text" value={formData.brandName} onChange={(e) => handleChange("brandName", e.target.value)} placeholder="Enter brand name" className="p-3 border border-gray-300 rounded-md" />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Generic Name</label>
            <CreatableSelect isClearable isDisabled={!formData.brandName} value={formData.genericName} onChange={(val) => handleChange("genericName", val)} options={genericNameOptions} placeholder="Select or create generic name" classNamePrefix="react-select" />
          </div>

          {/* Row 2 */}
          <div className="flex flex-col md:col-span-2">
            <label className="mb-2 font-semibold text-gray-700">Description</label>
            <textarea rows="4" value={formData.description} onChange={(e) => handleChange("description", e.target.value)} disabled={!formData.genericName} placeholder="Enter description" className="p-3 border border-gray-300 rounded-md resize-none" />
          </div>

          {/* Row 3 */}
          <div className="flex flex-col md:col-span-2">
            <label className="mb-2 font-semibold text-gray-700">Unit of Measurement</label>
            <CreatableSelect isClearable isDisabled={!formData.description} value={formData.unitType} onChange={handleUnitChange} options={unitOptions} placeholder="Select or create unit" classNamePrefix="react-select" />
          </div>

          {/* Row 4 */}
          {showMeasurementValue && (
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">Measurement Unit Value</label>
              <input type="number" step="0.01" value={formData.measurementValue} onChange={(e) => handleChange("measurementValue", e.target.value)} placeholder="Enter measurement value" className="p-3 border border-gray-300 rounded-md" />
            </div>
          )}

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Number of Pieces per Box</label>
            <input type="number" value={formData.piecesPerBox} onChange={(e) => handleChange("piecesPerBox", e.target.value)} placeholder="Enter number of pieces per box" disabled={!formData.unitType} className="p-3 border border-gray-300 rounded-md" />
          </div>

          {/* Row 5 - Reordered */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Selling Price (per box)</label>
            <input type="number" step="0.01" value={formData.spPerBox} onChange={(e) => handleChange("spPerBox", e.target.value)} disabled={!formData.piecesPerBox} placeholder="Enter SP per box" className="p-3 border border-gray-300 rounded-md" />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Selling Price (per piece)</label>
            <input type="number" step="0.01" value={formData.spPerPiece} onChange={(e) => handleChange("spPerPiece", e.target.value)} disabled={!formData.spPerBox} placeholder="Enter SP per piece" className="p-3 border border-gray-300 rounded-md" />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Cost Price (per box)</label>
            <input type="number" step="0.01" value={formData.cpPerBox} onChange={(e) => handleChange("cpPerBox", e.target.value)} disabled={!formData.spPerPiece} placeholder="Enter CP per box" className="p-3 border border-gray-300 rounded-md" />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Cost Price (per piece)</label>
            <input type="number" step="0.01" value={formData.cpPerPiece} onChange={(e) => handleChange("cpPerPiece", e.target.value)} disabled={!formData.cpPerBox} placeholder="Enter CP per piece" className="p-3 border border-gray-300 rounded-md" />
          </div>

          {/* Row 6 */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Category</label>
            <input type="text" value={formData.category} onChange={(e) => handleChange("category", e.target.value)} disabled={!formData.cpPerPiece} placeholder="Enter category" className="p-3 border border-gray-300 rounded-md" />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Supplier</label>
            <CreatableSelect isClearable isDisabled={!formData.category} value={formData.supplier} onChange={(val) => handleChange("supplier", val)} options={supplierOptions} placeholder="Select or create supplier" classNamePrefix="react-select" />
          </div>

          {/* Row 7 */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Tax Type</label>
            <CreatableSelect isClearable isDisabled={!formData.supplier} value={formData.taxType} onChange={(val) => handleChange("taxType", val)} options={taxTypeOptions} placeholder="Select or create tax type" classNamePrefix="react-select" />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Minimum Threshold</label>
            <input type="number" value={formData.minThreshold} onChange={(e) => handleChange("minThreshold", e.target.value)} disabled={!formData.taxType} placeholder="Enter minimum threshold" className="p-3 border border-gray-300 rounded-md" />
          </div>

          {/* Row 8 */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Maximum Threshold</label>
            <input type="number" value={formData.maxThreshold} onChange={(e) => handleChange("maxThreshold", e.target.value)} disabled={!formData.minThreshold} placeholder="Enter maximum threshold" className="p-3 border border-gray-300 rounded-md" />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Estimated Lead Time (days)</label>
            <input type="number" value={formData.leadTime} onChange={(e) => handleChange("leadTime", e.target.value)} disabled={!formData.maxThreshold} placeholder="Enter estimated lead time" className="p-3 border border-gray-300 rounded-md" />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button type="submit" disabled={!formData.leadTime} className="w-full bg-[#0070BA]  text-white font-semibold py-3 rounded-md transition">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;












