import React from "react";
import { useAuthContext } from "../../contexts/AuthContext";

const BooleanCheckbox = ({ label }) => {
  const { prescriptionRequired, setPrescriptionRequired } = useAuthContext();

  return (
    <div className="mt-7 rounded-lg border border-gray-300">
      <label className="flex items-center gap-2 text-sm font-medium p-3">
        <input
          type="checkbox"
          checked={prescriptionRequired}
          onChange={(e) => setPrescriptionRequired(e.target.checked)}
          className="w-4 h-4"
        />
        {label}
      </label>
    </div>
  );
};

export default BooleanCheckbox;
