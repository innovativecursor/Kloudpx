import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners"; 
import React from "react";

const GlobalLoader = () => {
  const loading = useSelector((state) => state.loading);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <ClipLoader color="#ffffff" size={60} />
    </div>
  );
};

export default GlobalLoader;
