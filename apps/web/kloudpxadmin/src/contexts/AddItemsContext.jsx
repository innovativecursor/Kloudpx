import { createContext, useContext } from "react";
import Swal from "sweetalert2";
import { useFormDataContext } from "./FormDataContext";
import { useDropdownContext } from "./DropdownContext";
import { useMeasurementContext } from "./MeasurementContext";
import { useImageContext } from "./ImageContext";
import { postAxiosCall, updateAxiosCall } from "../Axios/UniversalAxiosCalls";
import { useCategoryContext } from "./CategoryContext";
import { useNavigate } from "react-router-dom";
import endpoints from "../config/endpoints";

export const AddItemsContext = createContext();

const AddItemsProvider = ({ children }) => {
  const navigate = useNavigate();
  const {
    brandName,
    setBrandName,
    formData,
    setFormData,
    isBranded,
    setIsBranded,
    isPrescriptionRequired,
    setIsPrescriptionRequired,
    isInhouseBrand,
    setIsInhouseBrand,
    isfeature,
    setIsFeature,
  } = useFormDataContext();

  const {
    selectedGeneric,
    selectedSupplier,
    setSelectedGeneric,
    setSelectedSupplier,
  } = useDropdownContext();
  const { selectedCategory, setSelectedCategory, setSelectedCategoryIcon } =
    useCategoryContext();

  const {
    measurementType,
    setMeasurementType,
    measurementValue,
    setMeasurementValue,
    piecesPerBox,
    setPiecesPerBox,
    sellingPricePerBox,
    setSellingPricePerBox,
    sellingPricePerPiece,
    setSellingPricePerPiece,
    costPricePerBox,
    setCostPricePerBox,
    costPricePerPiece,
    setCostPricePerPiece,
  } = useMeasurementContext();

  const { uploadedImageIds, setUploadedImageIds, setBase64Images } =
    useImageContext();

  const handleSubmit = async (medicineId = null) => {
    const payload = {
      brandname: brandName,
      isbrand: isBranded,
      inhousebrand: isInhouseBrand,
      discount: `${formData.productDiscount}%`,
      power: formData.power,
      genericid: selectedGeneric?.value,
      supplierid: selectedSupplier?.value,
      categoryid: selectedCategory?.value,
      categorysubclass: formData.categorySubclass,
      dosageform: formData.dosageForm,
      packaging: formData.packaging,
      marketer: formData.marketer,
      itemcode: formData.itemcode,
      benefits: formData.benefits,
      keyingredients: formData.keyingredients,
      recommendeddailyallowance: formData.recommendeddailyallowance,
      directionsforuse: formData.directionsforuse,
      safetyinformation: formData.safetyinformation,

      taxtype:
        formData.taxtype && !isNaN(formData.taxtype)
          ? parseFloat(formData.taxtype)
          : 0,
      storage: formData.storage,
      supplierdiscount: `${formData.supplierDiscount}%`,
      description: formData.description,
      unitofmeasurement: measurementType?.value,
      measurementunitvalue: Number(measurementValue),
      numberofpiecesperbox:
        measurementType?.value === "per box" ? Number(piecesPerBox) : 0,
      sellingpriceperbox: Number(sellingPricePerBox),
      sellingpriceperpiece: Number(sellingPricePerPiece),
      costpriceperbox: Number(costPricePerBox),
      costpriceperpiece: Number(costPricePerPiece),
      // taxtype: taxOption?.value?.toLowerCase() || "non-vat",
      minimumthreshold: Number(formData.minThreshold),
      maximumthreshold: Number(formData.maxThreshold),
      estimatedleadtimedays: Number(formData.leadTime),
      prescription: isPrescriptionRequired,
      imageids: uploadedImageIds,
      isfeature: isfeature,
    };

    try {
      if (medicineId) {
        await updateAxiosCall(endpoints.medicine.update(medicineId), payload);
        Swal.fire("✅ Success", "Medicine updated!", "success");
      } else {
        await postAxiosCall(endpoints.medicine.add, payload);
        Swal.fire("✅ Success", "Medicine added!", "success");
      }
      setBrandName("");
      setFormData({
        power: "",
        productDiscount: "",
        supplierDiscount: "",
        minThreshold: "",
        maxThreshold: "",
        leadTime: "",
        categorySubclass: "",
        dosageForm: "",
        packaging: "",
        marketer: "",
        itemcode: "",
        description: "",
        benefits: "",
        keyingredients: "",
        recommendeddailyallowance: "",
        directionsforuse: "",
        safetyinformation: "",
        // taxtype: 0,
        taxtype: "",
        storage: "",
      });
      // setTaxOption(null);
      setIsBranded(false);
      setIsPrescriptionRequired(false);
      setIsInhouseBrand(false);
      setIsFeature(false);
      setSelectedGeneric(null);
      setSelectedSupplier(null);
      setSelectedCategory(null);
      setSelectedCategoryIcon(null);

      setMeasurementType(null);
      setMeasurementValue("");
      setPiecesPerBox("");
      setSellingPricePerBox("");
      setSellingPricePerPiece("");
      setCostPricePerBox("");
      setCostPricePerPiece("");

      setUploadedImageIds([]);
      setBase64Images([]);
      navigate("/allmedicine");
    } catch (error) {
      Swal.fire("❌ Error", "Failed to save medicine.", "error");
      console.error("❌ API Error:", error);
    }
  };

  return (
    <AddItemsContext.Provider value={{ handleSubmit }}>
      {children}
    </AddItemsContext.Provider>
  );
};

export default AddItemsProvider;
export const useAddItemsContext = () => useContext(AddItemsContext);
