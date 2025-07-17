"use client";
import { useSelector } from "react-redux";

const Loader = () => {
  const loading = useSelector((state) => state.loadingReducer.loading);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/20 backdrop-blur-sm flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white"></div>
    </div>
  );
};

export default Loader;
