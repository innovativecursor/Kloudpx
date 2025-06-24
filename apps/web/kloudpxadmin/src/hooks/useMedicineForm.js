import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import useCreatableSelect from "./useCreatableSelect";

import { constructMedicinePayload } from "./constructMedicinePayload";
import { calculatePricePerPiece } from "./calculatePricePerPiece";
import { getMedicineFromId } from "./getMedicineFromId";
import { useAuthContext } from "../contexts/AuthContext";
import endpoints from "../config/endpoints";

export default function useMedicineForm() {
  const {
    genericOptions,
    genericError,
    fetchGenericOptions,
    createGenericOption,
    supplierOptions,
    supplierError,
    fetchSupplierOptions,
    createSupplierOption,
    fetchCategoryOptions,
    createCategoryOption,
    categoryOptions,
    categoryError,
    token,
    prescriptionRequired,
    setPrescriptionRequired,
    medicines,
    handleUpload,
    handleImageChange,
    images,
    previewUrls,
    message,
    uploadedImageIds,
    setUploadedImageIds,
    setPreviewUrls,
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
    supplierDiscount: "",
    minThreshold: "",
    maxThreshold: "",
    leadTime: "",
  });

  const [showMeasurementValue, setShowMeasurementValue] = useState(false);

  const taxTypeOptions = [
    { value: "VAT 5%", label: "VAT 5%" },
    { value: "VAT 12%", label: "VAT 12%" },
    { value: "VAT 18%", label: "VAT 18%" },
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

  const {
    value: category,
    handleChange: handleCategoryChange,
    handleCreateOption: handleCategoryCreate,
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
    fetchCategoryOptions();
  }, []);

  useEffect(() => {
    if (!id || !medicines.length) return;
    const medData = getMedicineFromId(id, medicines);
    if (!medData) {
      alert("Medicine not found");
      return;
    }

    setFormData(medData.formData);
    handleGenericChange(medData.dropdownValues.generic);
    handleSupplierChange(medData.dropdownValues.supplier);
    handleCategoryChange(medData.dropdownValues.category);
    handleUnitChangeLocal(medData.dropdownValues.unit);
    handleTaxTypeChange(medData.dropdownValues.taxType);
    setPrescriptionRequired(medData.prescriptionRequired);
    setShowMeasurementValue(medData.showMeasurementValue);
    setUploadedImageIds(medData.uploadedImageIds);
    setPreviewUrls(medData.previewUrls);
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

    if (!prescriptionRequired) {
      alert("Please check 'Prescription Required' to proceed.");
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
    });

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
  };
}
