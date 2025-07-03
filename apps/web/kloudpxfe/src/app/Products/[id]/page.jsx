"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import SubTitle from "@/app/components/Titles/SubTitle";
import ImageSwiper from "@/app/components/ImageSwiper/ImageSwiper";
import QuantitySelector from "@/app/components/QuantitySelector/QuantitySelector";
import SocialIcons from "@/app/components/SocialIcons/SocialIcons";
import { useProductContext } from "@/app/contexts/ProductContext";
import { useCartContext } from "@/app/contexts/CartContext";
import { usePrescriptionContext } from "@/app/contexts/PrescriptionContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { allMedicine, selectedCategoryName } = useProductContext();
  const { isInCart } = useCartContext();
  const { uploadedImage } = usePrescriptionContext();
  const router = useRouter();
  const { quantity, addToCart } = useCartContext();
  const product = allMedicine.data.find((item) => String(item.ID) === id);
  const fallbackImage = "/assets/demo.jpg";

  if (allMedicine.loading) {
    return <div className="text-center p-10">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="p-10 text-red-600 text-center">Product Not Found</div>
    );
  }

  const medicineid = product.ID;
  console.log(product.Prescription);

  const handleAddToCart = () => {
    addToCart(medicineid, quantity, product?.Prescription, uploadedImage);
  };

  const isAlreadyInCart = isInCart(medicineid);

  const handleGoToCart = () => {
    router.push("/Cart");
  };

  console.log(product);

  return (
    <div className="bg-gray-100 pb-10 min-h-screen">
      <div className="responsive-mx pt-7 md:pt-11">
        <SubTitle paths={["Home", selectedCategoryName, product?.BrandName]} />

        <div className="md:flex gap-10 mt-6 sm:mt-12">
          {/* Image Swiper */}
          <ImageSwiper
            images={
              product.ItemImages?.map((img) => img.FileName) || [fallbackImage]
            }
          />

          {/* Right side - product info */}
          <div className="w-full md:w-1/2 mt-8 md:mt-0 flex flex-col px-4 sm:px-6 md:px-0">
            <div className="flex items-start gap-8">
              <h1 className="sm:text-4xl text-2xl font-extrabold text-gray-900 mb-3">
                {product?.BrandName}
              </h1>
              <SocialIcons />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2 ">
              {product?.Generic?.GenericName || "General Medicine"}
            </h2>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-[3px] text-yellow-400 text-xl">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="ri-star-fill"></i>
                ))}
              </div>
              <span className="text-red-800 font-medium text-base">
                120 Reviews
              </span>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg text-justify">
              {product?.Description || "No description available."}
            </p>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-green-600">
                ₹{product?.SellingPricePerBox || "N/A"}
              </span>
              <span className="text-sm text-gray-500 line-through -mt-2">
                MRP ₹{product?.CostPricePerBox || "N/A"}
              </span>
            </div>

            <div className="text-gray-700 font-semibold text-sm mb-6">
              <span>
                {product?.UnitOfMeasurement} {product?.MeasurementUnitValue}
              </span>
              <span className="mx-1">/</span>
              <span>{product?.NumberOfPiecesPerBox} per piece</span>
            </div>

            <QuantitySelector />

            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
              {isAlreadyInCart ? (
                <button
                  onClick={handleGoToCart}
                  type="button"
                  className="w-full sm:flex-1 flex items-center justify-center gap-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-base px-8 py-3 rounded-full shadow-sm transition-colors hover:border-blue-700 active:scale-95"
                >
                  <i className="ri-shopping-cart-2-line text-xl"></i>
                  Go to Cart
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  type="button"
                  className="w-full sm:flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-base px-8 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95"
                >
                  <i className="ri-shopping-cart-line text-xl"></i>
                  Add to Cart
                </button>
              )}

              <button
                type="button"
                className="w-full sm:flex-1 flex items-center justify-center gap-3 border-2 border-pink-500 text-pink-500 hover:bg-pink-50 font-semibold text-base px-8 py-3 rounded-full shadow-sm transition-colors hover:border-pink-600 active:scale-95"
              >
                <i className="ri-heart-line text-xl"></i>
                Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
