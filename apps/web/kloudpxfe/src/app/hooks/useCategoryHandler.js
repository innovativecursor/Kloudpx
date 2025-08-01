"use client";

import { useRouter } from "next/navigation";
import { useProductContext } from "../contexts/ProductContext";

const useCategoryHandler = () => {
  const {
    category,
    getItemsByCategory,
    setSelectedCategoryId,
    setSelectedCategoryName,
    // priceRange,
    // setPriceRange,
    // discountRange,
    // setDiscountRange,
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
    // setPriceRange([0, 1000]);
    // setDiscountRange([0, 100]);
    await getItemsByCategory(id);

    const categorySlug =
      selected?.CategoryName?.toLowerCase().replace(/\s+/g, "-") || "";

    router.push(`/Products?category=${id}&name=${categorySlug}`);

    onSuccessCallback();
  };

  return { handleCategoryClick };
};

export default useCategoryHandler;
