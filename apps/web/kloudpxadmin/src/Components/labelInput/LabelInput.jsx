export default function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  textarea = false,
  step,
}) {
  return (
    <div className="flex flex-col md:col-span-2">
      <label className="mb-1 font-semibold text-gray-700">{label}</label>
      {textarea ? (
        <textarea
          className="border rounded p-2"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <input
          className="border rounded p-2"
          value={value}
          onChange={onChange}
          type={type}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
    </div>
  );
}
