"use client";

import { useRouter } from "next/navigation";
import { useProductContext } from "../contexts/ProductContext";

const useCategoryHandler = () => {
  const {
    category,
    getItemsByCategory,
    setSelectedCategoryId,
    setSelectedCategoryName,
  } = useProductContext();

  const router = useRouter();

  const handleCategoryClick = async (
    id,
    fromHamburger = false,
    onSuccessCallback = () => { }
  ) => {
    const selected = category.find((cat) => cat.ID === id);
    if (!selected) return;

    if (fromHamburger) {
      setSelectedCategoryId(null);
    }

    setSelectedCategoryId(id);
    setSelectedCategoryName(selected?.CategoryName || "");

    await getItemsByCategory(id);

    const categorySlug =
      selected?.CategoryName?.toLowerCase().replace(/\s+/g, "-") || "";

    router.push(`/Products?category=${id}&name=${categorySlug}`);

    onSuccessCallback();
  };

  return { handleCategoryClick };
};

export default useCategoryHandler;
