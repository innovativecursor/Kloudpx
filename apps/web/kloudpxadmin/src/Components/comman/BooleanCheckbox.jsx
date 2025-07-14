import React from "react";
import { useFormDataContext } from "../../contexts/FormDataContext";

const BooleanCheckbox = () => {
  const {
    isBranded,
    setIsBranded,
    isPrescriptionRequired,
    setIsPrescriptionRequired,
    isInhouseBrand,
    setIsInhouseBrand,
  } = useFormDataContext();

  const checkboxes = [
    {
      id: "branded",
      label: "Branded Product",
      checked: isBranded,
      onChange: setIsBranded,
    },
    {
      id: "prescription",
      label: "Prescription Required",
      checked: isPrescriptionRequired,
      onChange: setIsPrescriptionRequired,
    },
    {
      id: "inhouse",
      label: "In-house Brand",
      checked: isInhouseBrand,
      onChange: setIsInhouseBrand,
    },
  ];

  return (
    <div className="grid sm:grid-cols-3 gap-3">
      {checkboxes.map((cb) => (
        <label key={cb.id} className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={cb.checked}
            onChange={(e) => cb.onChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          {cb.label}
        </label>
      ))}
    </div>
  );
};

export default BooleanCheckbox;
