import { useState } from "react";

const useCreatableSelect = (initialValue = null) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (selectedOption) => {
    setValue(selectedOption);
  };

  const handleCreateOption = async (inputValue, createFn) => {
    const newOption = await createFn(inputValue);
    if (newOption) {
      setValue(newOption);
    }
  };

  return {
    value,
    handleChange,
    handleCreateOption,
    setValue,
  };
};

export default useCreatableSelect;
