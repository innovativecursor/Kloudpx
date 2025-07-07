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
    <div className="w-full">
      <label className="block mb-1 text-gray-700 font-semibold">{label}</label>

      {textarea ? (
        <textarea
          className={`w-full rounded-md border border-gray-300 p-3 resize-none
                      focus:outline-none focus:border-blue-500 focus:border-2
                      disabled:opacity-50 disabled:cursor-not-allowed`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={4}
        />
      ) : (
        <input
          className={`w-full rounded-md border border-gray-500 p-3
                      focus:outline-none focus:border-blue-500 focus:border-2
                      disabled:opacity-30 disabled:cursor-not-allowed`}
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
