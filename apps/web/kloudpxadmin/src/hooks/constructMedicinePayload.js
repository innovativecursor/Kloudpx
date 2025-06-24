export const constructMedicinePayload = ({
  formData,
  genericName,
  supplier,
  category,
  unitType,
  taxType,
  uploadedImageIds,
  prescriptionRequired,
}) => {
  return {
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
    categoryid: Number(category.value),
    taxtype: taxType?.value || "VAT",
    minimumthreshold: parseInt(formData.minThreshold),
    maximumthreshold: parseInt(formData.maxThreshold),
    estimatedleadtimedays: parseInt(formData.leadTime),
    imageids: uploadedImageIds,
    prescription: prescriptionRequired,
  };
};
