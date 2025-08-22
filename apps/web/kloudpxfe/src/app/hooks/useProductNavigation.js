"use client";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/app/utils/slugify";
import usePageLoader from "./usePageLoader";

const useProductNavigation = () => {
  const router = useRouter();
  const { startLoader } = usePageLoader();

  const goToProductPage = (id, genericname) => {
    const slug = generateSlug(genericname);
    startLoader(`/Products/${slug}/${id}`);
    router.push(`/Products/${slug}/${id}`);
  };

  return { goToProductPage };
};

export default useProductNavigation;


