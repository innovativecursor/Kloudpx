import React from "react";

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  disabled = false,
  step,
  textarea = false,
}) => {
  return (
    <div className="flex flex-col">
      <label className="mb-2 font-semibold text-gray-700">{label}</label>
      {textarea ? (
        <textarea
          rows="4"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="p-3 border border-gray-300 rounded-md resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          step={step}
          className="p-3 border border-gray-300 rounded-md"
        />
      )}
    </div>
  );
};

export default Input;
