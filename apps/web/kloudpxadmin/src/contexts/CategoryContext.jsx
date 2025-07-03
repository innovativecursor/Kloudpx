import { createContext, useContext, useState } from "react";
import { useAuthContext } from "./AuthContext";
import { getAxiosCall, postAxiosCall } from "../Axios/UniversalAxiosCalls";

export const CategoryContext = createContext();

const CategoryProvider = ({ children }) => {
  const { checkToken } = useAuthContext();
  const [categoryIconOptions, setCategoryIconOptions] = useState([]);
  const [categoryIconError, setCategoryIconError] = useState("");
  const [selectedCategoryIcon, setSelectedCategoryIcon] = useState(null);
  const iconid = selectedCategoryIcon?.value || null;

  const fetchCategoryIconOptions = async () => {
    if (!checkToken()) {
      console.error("No token found, please login.");
      return;
    }
    try {
      const res = await getAxiosCall("/v1/category/get-all-category-icon");
      if (res?.data?.icons) {
        const formatted = res.data.icons.map((item) => ({
          label: item.Icon,
          value: item.ID,
        }));
        setCategoryIconOptions(formatted);
      }
    } catch (err) {
      console.error("Failed to load icons.", err);
    }
  };

  const createICategoryIcon = async (inputValue) => {
    if (!checkToken()) {
      setCategoryIconError("Token missing, please login again.");
      return null;
    }
    try {
      const res = await postAxiosCall(`/v1/category/add-category-icon`, {
        icon: inputValue,
      });
      if (res?.icon) {
        const created = res.icon;
        const newOption = { value: created.ID, label: created.Icon };

        setCategoryIconOptions((prev) => [...prev, newOption]);
        setSelectedCategoryIcon(newOption);

        setCategoryIconError("");
        return newOption;
      } else {
        setCategoryIconError("Failed to add new category icon.");
        return null;
      }
    } catch (error) {
      setCategoryIconError("Failed to add new category icon.");
      return null;
    }
  };

  const handleSelectCategoryIcon = (option) => {
    setSelectedCategoryIcon(option);
  };

  return (
    <CategoryContext.Provider
      value={{
        categoryIconOptions,
        categoryIconError,
        selectedCategoryIcon,
        fetchCategoryIconOptions,
        createICategoryIcon,
        handleSelectCategoryIcon,
        iconid,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryProvider;
export const useCategoryContext = () => useContext(CategoryContext);
