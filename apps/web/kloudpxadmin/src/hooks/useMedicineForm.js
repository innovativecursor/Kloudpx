import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import useCreatableSelect from "../hooks/useCreatableSelect";

import { constructMedicinePayload } from "./constructMedicinePayload";
import { calculatePricePerPiece } from "./calculatePricePerPiece";
import { getMedicineFromId } from "./getMedicineFromId";
import { useAuthContext } from "../contexts/AuthContext";
import endpoints from "../config/endpoints";
import { useImageContext } from "../contexts/ImageContext";
import { useDropdownContext } from "../contexts/DropdownContext";
import { useCategoryContext } from "../contexts/CategoryContext";

export default function useMedicineForm() {
  const { token, prescriptionRequired, setPrescriptionRequired, medicines } =
    useAuthContext();

  const {
    categoryIconOptions,
    categoryIconError,
    fetchCategoryIconOptions,
    createICategoryIcon,
    handleSelectCategoryIcon,
  } = useCategoryContext();

  const {
    images,
    previewUrls,
    message,
    uploadedImageIds,
    setUploadedImageIds,
    setPreviewUrls,
    setMessage,
    handleImageChange,
    handleUpload,
  } = useImageContext();

  const {
    genericOptions,
    genericError,
    fetchGenericOptions,
    createGenericOption,

    supplierOptions,
    supplierError,
    fetchSupplierOptions,
    createSupplierOption,

    categoryOptions,
    categoryError,
    fetchCategoryOptions,
    createCategoryOption,
  } = useDropdownContext();

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
    supplierDiscount: "",
    minThreshold: "",
    maxThreshold: "",
    leadTime: "",
    power: "",
  });

  const [showMeasurementValue, setShowMeasurementValue] = useState(false);

  const taxTypeOptions = [
    { value: "VAT", label: "VAT" },
    { value: "NON VAT", label: "NON VAT" },
  ];

  const unitOptions = [
    { value: "per box", label: "per box" },
    { value: "per piece", label: "per piece" },
  ];

  const {
    value: genericName,
    handleChange: handleGenericChange,
    handleCreateOption: handleGenericCreate,
  } = useCreatableSelect(createGenericOption);

  const { value: unitType, handleChange: handleUnitChangeLocal } =
    useCreatableSelect();
  const {
    value: supplier,
    handleChange: handleSupplierChange,
    handleCreateOption: handleSupplierCreate,
  } = useCreatableSelect(createSupplierOption);

  const {
    value: category,
    handleChange: handleCategoryChange,
    handleCreateOption: handleCategoryCreate,
  } = useCreatableSelect(createCategoryOption);

  const {
    value: categoryIcon,
    handleChange: handleCategoryIconChangeLocal,
    handleCreateOption: handleCategoryIconCreate,
  } = useCreatableSelect(createICategoryIcon);

  const handleCategoryIconChange = (val) => {
    handleCategoryIconChangeLocal(val);
    handleSelectCategoryIcon(val);
  };


  console.log(categoryIcon);
  
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
    fetchCategoryOptions();
    fetchCategoryIconOptions();
  }, []);

  useEffect(() => {
    if (!id || !medicines.length) return;
    const medData = getMedicineFromId(id, medicines);
    if (!medData) {
      alert("Medicine not found");
      return;
    }
    console.log("Loaded medicine data for edit:", medData);
    // setFormData(medData.formData);
    setFormData((prev) => ({
      ...medData.formData,
      power: medData.formData.power || "",
    }));

    handleGenericChange(medData.dropdownValues.generic);
    handleSupplierChange(medData.dropdownValues.supplier);
    handleCategoryChange(medData.dropdownValues.category);
    handleUnitChangeLocal(medData.dropdownValues.unit);
    handleTaxTypeChange(medData.dropdownValues.taxType);
    setPrescriptionRequired(medData.prescriptionRequired);
    setShowMeasurementValue(medData.showMeasurementValue);
    setUploadedImageIds(medData.uploadedImageIds);
    setPreviewUrls(medData.previewUrls);
    handleCategoryIconChange(medData.dropdownValues.categoryIcon);
    setFormData((prev) => ({ ...prev, power: medData.formData.power || "" }));
  }, [id, medicines]);

  useEffect(() => {
    const { spPerPiece, cpPerPiece } = calculatePricePerPiece({
      ...formData,
      showMeasurementValue,
    });

    setFormData((prev) => ({
      ...prev,
      spPerPiece,
      cpPerPiece,
    }));
  }, [
    formData.spPerBox,
    formData.cpPerBox,
    formData.measurementValue,
    formData.piecesPerBox,
    showMeasurementValue,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !genericName?.value ||
      !supplier?.value ||
      !unitType?.value ||
      !category?.value
    ) {
      alert("Please select Generic Name, Supplier, and Unit.");
      return;
    }

    const payload = constructMedicinePayload({
      formData,
      genericName,
      supplier,
      category,
      unitType,
      taxType,
      uploadedImageIds,
      prescriptionRequired,
      categoryIcon: categoryIcon,
    });
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
      setPrescriptionRequired(false);
      setMessage("");
      setPreviewUrls([]);
    } catch (err) {
      console.error("Error submitting:", err);
      alert("Failed to submit medicine data.");
    }
  };

  return {
    formData,
    setFormData,
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
    setPrescriptionRequired,
    handleSubmit,
    handleUpload,
    handleImageChange,
    images,
    previewUrls,
    message,
    id,
    uploadedImageIds,
    categoryIcon,
    handleCategoryIconChange,
    handleCategoryIconCreate,
    categoryIconOptions,
    categoryIconError,
  };
}
