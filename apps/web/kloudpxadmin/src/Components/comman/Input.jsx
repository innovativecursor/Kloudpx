import React from "react";
import { useFormDataContext } from "../../contexts/FormDataContext";

const Input = ({ label, name, type = "text", placeholder }) => {
  const { formData, updateFormData } = useFormDataContext();

  return (
    <div className="">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name] || ""}
        onChange={(e) => updateFormData(name, e.target.value)}
        className="w-full px-3 py-4 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      />
    </div>
  );
};

export default Input;
