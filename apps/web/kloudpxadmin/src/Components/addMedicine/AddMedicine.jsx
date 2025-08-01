import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Dropdown from "../../Components/comman/Dropdown";
import MeasurementUnit from "../comman/MeasurementUnit";
import PriceFields from "../comman/PriceFields";
import ImageUploader from "../imageUploader/ImageUploader";
import TaxSelect from "../comman/TaxSelect";
import Input from "../comman/Input";
import BooleanCheckbox from "../comman/BooleanCheckbox";
import { useFormDataContext } from "../../contexts/FormDataContext";
import { useAddItemsContext } from "../../contexts/AddItemsContext";
import { useDropdownContext } from "../../contexts/DropdownContext";
import { useMeasurementContext } from "../../contexts/MeasurementContext";
import { useCategoryContext } from "../../contexts/CategoryContext";

const AddMedicine = () => {
  const location = useLocation();
  const medicine = location.state?.medicine;

  const {
    brandName,
    setBrandName,
    setFormData,
    taxOption,
    setTaxOption,
    setIsBranded,
    setIsInhouseBrand,
    setIsPrescriptionRequired,
    setIsFeature,
  } = useFormDataContext();

  const { setSelectedGeneric, setSelectedSupplier } = useDropdownContext();
  const { setSelectedCategory, setSelectedCategoryIcon } = useCategoryContext();
  const {
    setMeasurementType,
    setMeasurementValue,
    setPiecesPerBox,
    setSellingPricePerBox,
    setSellingPricePerPiece,
    setCostPricePerBox,

    setCostPricePerPiece,
  } = useMeasurementContext();

  const { handleSubmit } = useAddItemsContext();

  useEffect(() => {
    if (medicine) {
      prefillData(medicine);
    }
  }, [medicine]);

  const prefillData = (data) => {
    setBrandName(data.BrandName);
    setTaxOption({ label: data.TaxType, value: data.TaxType });
    setFormData({
      power: data.Power,
      productDiscount: data.Discount?.replace("%", ""),
      supplierDiscount: data.SupplierDiscount?.replace("%", ""),
      minThreshold: data.MinimumThreshold,
      maxThreshold: data.MaximumThreshold,
      leadTime: data.EstimatedLeadTimeDays,
      categorySubclass: data.CategorySubClass,
      dosageForm: data.DosageForm,
      packaging: data.Packaging,
      marketer: data.Marketer,
      itemcode: data.ItemCode,
      benefits: data.Benefits,
      keyingredients: data.KeyIngredients,
      recommendeddailyallowance: data.RecommendedDailyAllowance,
      directionsforuse: data.DirectionsForUse,
      safetyinformation: data.SafetyInformation,
      storage: data.Storage,
      description: data.Description,
    });
    setSelectedGeneric({
      label: data.Generic?.GenericName,
      value: data.GenericID,
    });
    setSelectedSupplier({
      label: data.Supplier?.SupplierName,
      value: data.SupplierID,
    });
    setSelectedCategory({
      label: data.Category?.CategoryName,
      value: data.CategoryID,
    });
    setSelectedCategoryIcon({
      label: data.Category?.CategoryIcon?.Icon,
      value: data.CategoryIconID,
    });
    setMeasurementType({
      label: data.UnitOfMeasurement,
      value: data.UnitOfMeasurement,
    });
    setMeasurementValue(data.MeasurementUnitValue);
    setPiecesPerBox(data.NumberOfPiecesPerBox);
    setSellingPricePerBox(data.SellingPricePerBox);
    setSellingPricePerPiece(data.SellingPricePerPiece);
    setCostPricePerBox(data.CostPricePerBox);
    setCostPricePerPiece(data.CostPricePerPiece);
    setIsBranded(data.IsBrand);
    setIsInhouseBrand(data.InhouseBrand);
    setIsPrescriptionRequired(data.Prescription);
    setIsFeature(data.IsFeature);
  };

  return (
    <div className="max-w-6xl md:mx-auto mx-3  md:px-16 px-7 py-12 bg-white border border-[#0070ba] rounded-md my-20 shadow-md">
      <h2 className="text-4xl font-bold mb-9 text-center text-[#0070ba]">
        {medicine ? "✏️ Edit Items" : "➕ Add Items"}
      </h2>

      <div>
        <label className="block font-medium mb-1">Brand Name</label>
        <input
          type="text"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          className="w-full px-3 py-3.5 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Enter brand name"
        />
      </div>

      <div className="my-10">
        <Input
          label="Description"
          name="description"
          placeholder="Enter product description"
        />
      </div>
      <div className="my-10">
        <Dropdown type="generic" label="Generic Name" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Dropdown type="supplier" label="Supplier Name" />
        <Input
          label="Supplier Discount (%)"
          name="supplierDiscount"
          placeholder="Enter supplier discount"
        />
        <Dropdown type="category" label="Select or Create Category" />
        <Dropdown type="categoryIcon" label="Select Category Icon" />
        <Input
          label="Dosage Form"
          name="dosageForm"
          placeholder="e.g. Tablet, Syrup"
        />
        <Input
          label="Packaging"
          name="packaging"
          placeholder="e.g. Strip, Bottle"
        />
        <Input label="Power" name="power" placeholder="e.g. 500mg" />
        <Input
          label="Product Discount (%)"
          name="productDiscount"
          placeholder="Enter product discount"
        />
        <Input
          label="Minimum Threshold"
          name="minThreshold"
          placeholder="Enter minimum stock threshold"
        />
        <Input
          label="Maximum Threshold"
          name="maxThreshold"
          placeholder="Enter maximum stock threshold"
        />
        <Input
          label="Category Subclass"
          name="categorySubclass"
          placeholder="Enter subclass (optional)"
        />
        <Input
          label="Marketer"
          name="marketer"
          placeholder="Enter marketer name"
        />
      </div>

      <div className="my-10">
        <Input label="Itemcode" name="itemcode" placeholder="Enter itemcode" />
      </div>

      {/* Full-width components */}
      <div className="my-10">
        <MeasurementUnit />
      </div>

      <div className="my-10">
        <PriceFields />
      </div>

      <div className="my-10">
        <Input
          label="Estimated Lead Time (days)"
          name="leadTime"
          placeholder="Enter estimated delivery time"
        />
      </div>

      <div>
        <TaxSelect value={taxOption} onChange={setTaxOption} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-10">
        <Input
          label="Benefits"
          name="benefits"
          placeholder="Enter benefits name"
        />
        <Input
          label="Keyingredients"
          name="keyingredients"
          placeholder="Enter Keyingredients name"
        />
        <Input
          label="Recommendeddailyallowance"
          name="recommendeddailyallowance"
          placeholder="Enter Recommendeddailyallowance name"
        />
        <Input
          label="Directionsforuse"
          name="directionsforuse"
          placeholder="Enter Directionsforuse name"
        />
        <Input
          label="Safetyinformation"
          name="safetyinformation"
          placeholder="Enter Safetyinformation name"
        />
        <Input
          label="Storage"
          name="storage"
          placeholder="Enter Storage name"
        />
      </div>

      <div className="my-10">
        <ImageUploader />
      </div>

      <div className="my-7">
        <BooleanCheckbox />
      </div>

      <button
        onClick={() => handleSubmit(medicine?.ID)}
        className="mt-8 w-full py-3 bg-[#0070ba] text-white text-lg rounded-md transition"
      >
        {medicine ? "Update Items" : "Submit Items"}
      </button>
    </div>
  );
};

export default AddMedicine;
