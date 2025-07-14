import { createContext, useContext, useEffect, useState } from "react";
import { getAxiosCall, postAxiosCall } from "../Axios/UniversalAxiosCalls";

export const CategoryContext = createContext();

const CategoryProvider = ({ children }) => {
  const [categoryIconOptions, setCategoryIconOptions] = useState([]);
  const [selectedCategoryIcon, setSelectedCategoryIcon] = useState(null);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryError, setCategoryError] = useState("");

  const fetchCategoryIcons = async () => {
    try {
      const res = await getAxiosCall("/v1/category/get-all-category-icon");
      const data = res?.data?.icons || [];

      const formatted = data.map((item) => ({
        label: item.Icon,
        value: item.ID,
      }));
      setCategoryIconOptions(formatted);
    } catch (error) {
      console.error("❌ Category icon fetch error:", error);
    }
  };

  const fetchCategoryOptions = async () => {
    try {
      const res = await getAxiosCall("/v1/category/get-all-category");
      const categories = res?.data?.categories || [];

      const formatted = categories.map((item) => ({
        label: item.CategoryName,
        value: item.ID,
        icon: item.CategoryIcon?.Icon || null,
        iconId: item.CategoryIconID || null,
      }));
      console.log("📦 All categories from API:", formatted);
      setCategoryOptions(formatted);
    } catch (error) {
      setCategoryError("Failed to load categories.");
    }
  };

  // ✅ 3. Create category
  const createCategoryOption = async (inputValue) => {
    console.log("🟢 Creating category:", inputValue);
    try {
      const res = await postAxiosCall("/v1/category/add-category", {
        category: inputValue,
      });

      console.log("✅ API Response from /add-category:", res);
      const created = res?.category;

      if (created) {
        const newOption = {
          value: created.ID,
          label: created.CategoryName,
          icon: created.CategoryIcon?.Icon || null,
          iconId: created.CategoryIconID || null,
        };

        console.log("🆕 New category option:", newOption);
        setCategoryOptions((prev) => {
          const exists = prev.find((opt) => opt.value === newOption.value);
          if (!exists) return [...prev, newOption];
          return prev;
        });

        setSelectedCategory(newOption);

        if (newOption.icon && newOption.iconId) {
          console.log("🎯 Auto-selecting icon:", newOption.icon);
          setSelectedCategoryIcon({
            label: newOption.icon,
            value: newOption.iconId,
          });
        }

        return newOption;
      } else {
        setCategoryError("Failed to add new category.");
        return null;
      }
    } catch (error) {
      console.error("❌ Category create error:", error);
      setCategoryError("Failed to add new category.");
      return null;
    }
  };

  // ✅ 4. Assign icon to category
  const assignIconToCategory = async (categoryId, iconId) => {
    const payload = {
      category_id: categoryId,
      icon_id: iconId,
    };

    try {
      const res = await postAxiosCall("/v1/category/assign-icon", payload);
      console.log("✅ Icon assigned:", res);
    } catch (error) {
      console.error("❌ Icon assign failed:", error);
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categoryIconOptions,
        selectedCategoryIcon,
        setSelectedCategoryIcon,
        fetchCategoryIcons,

        categoryOptions,
        selectedCategory,
        setSelectedCategory,
        fetchCategoryOptions,
        createCategoryOption,
        categoryError,

        assignIconToCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryProvider;
export const useCategoryContext = () => useContext(CategoryContext);
