"use client";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/app/utils/slugify";

const useProductNavigation = () => {
  const router = useRouter();

  const goToProductPage = (id, genericname) => {
    const slug = generateSlug(genericname);
    router.push(`/Products/${slug}/${id}`);
  };

  return { goToProductPage };
};

export default useProductNavigation;
