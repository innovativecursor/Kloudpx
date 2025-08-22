"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import usePageLoader from "@/app/hooks/usePageLoader";


const LoaderController = () => {
  const { stopLoader } = usePageLoader();
  const pathname = usePathname();

  useEffect(() => {
    stopLoader(); 
  }, [pathname, stopLoader]);

  return null;
};

export default LoaderController;
