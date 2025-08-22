"use client";
import { useDispatch } from "react-redux";
import { usePathname } from "next/navigation";

export default function usePageLoader() {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const startLoader = (targetPath) => {
    if (targetPath !== pathname) {
      dispatch({ type: "LOADING", payload: true });
    }
  };

  const stopLoader = () => {
    dispatch({ type: "LOADING", payload: false });
  };

  return { startLoader, stopLoader };
}
