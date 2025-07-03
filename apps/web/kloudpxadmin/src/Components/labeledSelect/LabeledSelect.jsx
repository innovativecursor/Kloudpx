import CustomCreatableSelect from "../comman/CustomCreatableSelect";

export default function LabeledSelect({
  label,
  value,
  onChange,
  onCreate,
  options,
  disabled,
  placeholder,
  formatOptionLabel,
}) {
  return (
    <div className="flex flex-col md:col-span-2">
      <label className="mb-1 font-semibold text-gray-700">{label}</label>
      <CustomCreatableSelect
        value={value}
        onChange={onChange}
        onCreateOption={onCreate}
        options={options}
        isDisabled={disabled}
        placeholder={placeholder}
        formatOptionLabel={formatOptionLabel}
      />
    </div>
  );
}