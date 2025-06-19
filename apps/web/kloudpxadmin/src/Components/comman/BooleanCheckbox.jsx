import React from "react";
import { useAuthContext } from "../../contexts/AuthContext";

const BooleanCheckbox = ({ label }) => {
  const { prescriptionRequired, setPrescriptionRequired } = useAuthContext();

  console.log(prescriptionRequired);

  return (
    <div className="mt-6 mx-6">
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={prescriptionRequired}
          onChange={(e) => setPrescriptionRequired(e.target.checked)}
          className="w-4 h-4"
        />
        {label}
      </label>

      {/* <p className="text-blue-700 font-semibold">
        {prescriptionRequired
          ? "Prescription required is true — This is a Medicine"
          : "Prescription required is false — This is an OTC"}
      </p> */}
    </div>
  );
};

export default BooleanCheckbox;
