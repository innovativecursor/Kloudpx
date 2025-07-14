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
    isfeature,
    setIsFeature,
  } = useFormDataContext();

  const checkboxes = [
    {
      id: "branded",
      label: " Mark as a branded Product",
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
      label: "Is this an in-house brand product?",
      checked: isInhouseBrand,
      onChange: setIsInhouseBrand,
    },
    {
      id: "isfeature",
      label: "Mark as a featured product",
      checked: isfeature,
      onChange: setIsFeature,
    },
  ];

  return (
    <div className="grid sm:grid-cols-3 gap-5">
      {checkboxes.map((cb) => (
        <label
          key={cb.id}
          className="flex items-center gap-2 font-semibold md:text-base text-sm"
        >
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
