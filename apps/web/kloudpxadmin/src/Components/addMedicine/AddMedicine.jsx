import React, { useState } from "react";
import Title from "../comman/Title";
import CreatableSelect from "react-select/creatable";

const AddMedicine = () => {

  const [genericName, setGenericName] = useState(null);
  const [taxType, setTaxType] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [unitType, setUnitType] = useState(null);
  const [showMeasurementValue, setShowMeasurementValue] = useState(false);


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
    setUnitType(newValue);
    setShowMeasurementValue(newValue?.value === "per box");
  };

  return (
    <div className="flex justify-center items-center mb-20">
      <div className="responsive-mx card">
        <Title text="Add Medicine" />
        <form className="mt-8 grid grid-cols-1 px-5 md:grid-cols-2 gap-6">

          <div className="flex flex-col">
            <label htmlFor="brandName" className="mb-2 font-semibold text-gray-700">
              Brand Name
            </label>
            <input id="brandName" type="text" placeholder="Enter brand name" className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>


          <div className="flex flex-col">
            <label htmlFor="genericName" className="mb-2 font-semibold text-gray-700">
              Generic Name
            </label>
            <CreatableSelect
              id="genericName"
              isClearable
              onChange={(newValue) => setGenericName(newValue)}
              options={genericNameOptions}
              placeholder="Select or create generic name"
              classNamePrefix="react-select"
              styles={{ control: (base) => ({ ...base, padding: "2px", borderRadius: "0.375rem", borderColor: "#d1d5db", boxShadow: "none", "&:hover": { borderColor: "#3b82f6" } }) }}
            />
          </div>


          <div className="flex flex-col md:col-span-2">
            <label htmlFor="description" className="mb-2 font-semibold text-gray-700">
              Description
            </label>
            <textarea id="description" rows="4" placeholder="Enter description" className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>


          <div className="flex flex-col md:col-span-2">
            <label htmlFor="unitOfMeasurement" className="mb-2 font-semibold text-gray-700">
              Unit of Measurement
            </label>
            <CreatableSelect
              id="unitOfMeasurement"
              isClearable
              onChange={handleUnitChange}
              options={unitOptions}
              placeholder="Select or create unit"
              classNamePrefix="react-select"
              styles={{ control: (base) => ({ ...base, padding: "2px", borderRadius: "0.375rem", borderColor: "#d1d5db", boxShadow: "none", "&:hover": { borderColor: "#3b82f6" } }) }}
            />
          </div>


          {showMeasurementValue && (
            <div className="flex flex-col">
              <label htmlFor="measurementValue" className="mb-2 font-semibold text-gray-700">
                Measurement Unit Value
              </label>
              <input id="measurementValue" type="number" step="0.01" placeholder="Enter measurement value" className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          )}

          <div className="flex flex-col">
            <label htmlFor="piecesPerBox" className="mb-2 font-semibold text-gray-700">
              Number of Pieces per Box
            </label>
            <input id="piecesPerBox" type="number" placeholder="Enter number of pieces per box" className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>


          <div className="flex flex-col">
            <label htmlFor="category" className="mb-2 font-semibold text-gray-700">
              Category
            </label>
            <input id="category" type="text" placeholder="Enter category" className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="supplier" className="mb-2 font-semibold text-gray-700">
              Supplier
            </label>
            <CreatableSelect
              id="supplier"
              isClearable
              onChange={(newValue) => setSupplier(newValue)}
              options={supplierOptions}
              placeholder="Select or create supplier"
              classNamePrefix="react-select"
              styles={{ control: (base) => ({ ...base, padding: "2px", borderRadius: "0.375rem", borderColor: "#d1d5db", boxShadow: "none", "&:hover": { borderColor: "#3b82f6" } }) }}
            />
          </div>


          <div className="flex flex-col">
            <label htmlFor="purchasePrice" className="mb-2 font-semibold text-gray-700">
              Purchase Price
            </label>
            <input id="purchasePrice" type="number" step="0.01" placeholder="Enter purchase price" className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>


          <div className="flex flex-col">
            <label htmlFor="sellingPrice" className="mb-2 font-semibold text-gray-700">
              Selling Price
            </label>
            <input id="sellingPrice" type="number" step="0.01" placeholder="Enter selling price" className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>


          <div className="flex flex-col">
            <label htmlFor="taxType" className="mb-2 font-semibold text-gray-700">
              Tax Type
            </label>
            <CreatableSelect
              id="taxType"
              isClearable
              onChange={(newValue) => setTaxType(newValue)}
              options={taxTypeOptions}
              placeholder="Select or create tax type"
              classNamePrefix="react-select"
              styles={{ control: (base) => ({ ...base, padding: "2px", borderRadius: "0.375rem", borderColor: "#d1d5db", boxShadow: "none", "&:hover": { borderColor: "#3b82f6" } }) }}
            />
          </div>


          <div className="flex flex-col">
            <label htmlFor="minThreshold" className="mb-2 font-semibold text-gray-700">
              Minimum Threshold
            </label>
            <input id="minThreshold" type="number" placeholder="Enter minimum threshold" className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="maxThreshold" className="mb-2 font-semibold text-gray-700">
              Maximum Threshold
            </label>
            <input id="maxThreshold" type="number" placeholder="Enter maximum threshold" className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>


          <div className="flex flex-col">
            <label htmlFor="leadTime" className="mb-2 font-semibold text-gray-700">
              Estimated Lead Time (days)
            </label>
            <input id="leadTime" type="number" placeholder="Enter estimated lead time" className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>


          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;
