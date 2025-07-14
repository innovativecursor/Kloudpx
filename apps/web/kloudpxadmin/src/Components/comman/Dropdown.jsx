import React, { useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

import { useDropdownContext } from "../../contexts/DropdownContext";
import { useCategoryContext } from "../../contexts/CategoryContext";
import { useIconComponent } from "../../hooks/useIconComponent";

const customStyles = {
  control: (base, state) => ({
    ...base,
    padding: "0px 8px",
    minHeight: "3.5rem",
    borderRadius: "0.5rem",
    borderColor: state.isFocused ? "#3b82f6" : "#6b7280",
    boxShadow: state.isFocused
      ? "0 0 0 2px #3b82f6"
      : "0 1px 2px rgba(0,0,0,0.05)",
    backgroundColor: "white",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: "#3b82f6",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 4px",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 20,
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    overflow: "hidden",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#eff6ff" : "white",
    color: "#111827",
    padding: "10px 12px",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#111827",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
  }),
};

const Dropdown = ({ type, label }) => {
  const {
    genericOptions,
    selectedGeneric,
    setSelectedGeneric,
    fetchGenericOptions,
    createGenericOption,

    supplierOptions,
    selectedSupplier,
    setSelectedSupplier,
    fetchSupplierOptions,
    createSupplierOption,
  } = useDropdownContext();

  const {
    categoryIconOptions,
    selectedCategoryIcon,
    setSelectedCategoryIcon,
    fetchCategoryIcons,
    categoryOptions,
    selectedCategory,
    setSelectedCategory,
    fetchCategoryOptions,
    createCategoryOption,
    assignIconToCategory,
  } = useCategoryContext();

  let options = [];
  let selected = null;
  let setSelected = () => {};
  let fetchOptions = () => {};
  let createOption = null;
  let isCreatable = true;

  if (type === "generic") {
    options = genericOptions;
    selected = selectedGeneric;
    setSelected = setSelectedGeneric;
    fetchOptions = fetchGenericOptions;
    createOption = createGenericOption;
  } else if (type === "supplier") {
    options = supplierOptions;
    selected = selectedSupplier;
    setSelected = setSelectedSupplier;
    fetchOptions = fetchSupplierOptions;
    createOption = createSupplierOption;
  } else if (type === "categoryIcon") {
    options = categoryIconOptions;
    selected = selectedCategoryIcon;
    setSelected = setSelectedCategoryIcon;
    fetchOptions = fetchCategoryIcons;
    isCreatable = false;
  } else if (type === "category") {
    options = categoryOptions;
    selected = selectedCategory;
    setSelected = setSelectedCategory;
    fetchOptions = fetchCategoryOptions;
    createOption = createCategoryOption;
  }

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleChange = (option) => {
    setSelected(option);

    if (type === "category" && option?.iconId) {
      const matchedIcon = categoryIconOptions.find(
        (icon) => icon.value === option.iconId
      );

      if (matchedIcon) {
        setSelectedCategoryIcon({
          label: matchedIcon.label,
          value: matchedIcon.value,
        });
      } else {
        setSelectedCategoryIcon(null);
      }
    }

    if (type === "category" && option?.value && selectedCategoryIcon?.value) {
      assignIconToCategory(option.value, selectedCategoryIcon.value);
    }

    if (type === "categoryIcon" && option?.value && selectedCategory?.value) {
      assignIconToCategory(selectedCategory.value, option.value);
    }
  };

  const handleCreate = async (inputValue) => {
    if (!createOption) return;
    const newOption = await createOption(inputValue);
    if (newOption) {
      setSelected(newOption);
    }
  };

  const formatOptionLabel = (option) => {
    if (type !== "categoryIcon") return option.label;

    const Icon = useIconComponent(option.label);
    return (
      <div className="flex items-center gap-2">
        {Icon && <Icon size={20} />}
      </div>
    );
  };

  return (
    <div className="">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      {isCreatable ? (
        <CreatableSelect
          isClearable
          value={selected}
          onChange={handleChange}
          onCreateOption={handleCreate}
          options={options}
          styles={customStyles}
          formatOptionLabel={formatOptionLabel}
          placeholder={`Select or create ${label.toLowerCase()}`}
        />
      ) : (
        <Select
          isClearable
          value={selected}
          onChange={handleChange}
          options={options}
          styles={customStyles}
          formatOptionLabel={formatOptionLabel}
          placeholder={`Select ${label.toLowerCase()}`}
        />
      )}
    </div>
  );
};

export default Dropdown;
