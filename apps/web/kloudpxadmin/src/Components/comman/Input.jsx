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
  required = false,
  error = "",
}) => {
  const baseClass =
    "p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200";

  const disabledClass = disabled
    ? "bg-gray-100 cursor-not-allowed opacity-60"
    : "";
  const errorClass = error
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "border-gray-300";

  return (
    <div className="flex flex-col space-y-1 mb-4">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {textarea ? (
        <textarea
          rows="4"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseClass} ${disabledClass} ${errorClass} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          step={step}
          className={`${baseClass} ${disabledClass} ${errorClass}`}
        />
      )}

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
