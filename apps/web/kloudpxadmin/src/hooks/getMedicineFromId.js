export const getMedicineFromId = (id, medicines) => {
  const med = medicines.find((m) => m.ID === Number(id));
  if (!med) return null;

  const baseURL = "http://localhost:10001/uploads/";

  return {
    formData: {
      brandName: med.BrandName || "",
      power: med.Power || "",
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
    },
    dropdownValues: {
      generic: { value: med.Generic.ID, label: med.Generic.GenericName },
      supplier: { value: med.Supplier.ID, label: med.Supplier.SupplierName },
      category: {
        value: med.Category?.ID,
        label: med.Category?.CategoryName,
      },
      unit: { value: med.UnitOfMeasurement, label: med.UnitOfMeasurement },
      taxType: { value: med.TaxType, label: med.TaxType },

      categoryIcon: {
        value: med.Category?.CategoryIcon?.ID || "",
        label: med.Category?.CategoryIcon?.Icon || "",
      },
    },
    prescriptionRequired: med.Prescription,
    showMeasurementValue: med.UnitOfMeasurement === "per box",
    uploadedImageIds: med.ItemImages?.map((img) => img.ID) || [],
    previewUrls:
      med.ItemImages?.map((img) =>
        img.FileName?.startsWith("http")
          ? img.FileName
          : `${baseURL}${img.FileName}`
      ) || [],
  };
};
