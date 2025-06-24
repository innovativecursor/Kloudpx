import { useState } from "react";

const useCreatableSelect = (createFn, initialValue = null) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (selectedOption) => {
    setValue(selectedOption);
  };

  const handleCreateOption = async (inputValue) => {
    if (!createFn) {
      console.warn("No create function provided");
      return null;
    }
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
