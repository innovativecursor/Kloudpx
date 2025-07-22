"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import SubTitle from "@/app/components/Titles/SubTitle";
import ImageSwiper from "@/app/components/ImageSwiper/ImageSwiper";
import QuantitySelector from "@/app/components/QuantitySelector/QuantitySelector";
import SocialIcons from "@/app/components/SocialIcons/SocialIcons";
import { useProductContext } from "@/app/contexts/ProductContext";
import { useCartContext } from "@/app/contexts/CartContext";
import { usePrescriptionContext } from "@/app/contexts/PrescriptionContext";
import Prescription from "@/app/components/modal/Prescription";
import AddToCart from "@/app/components/button/AddToCart";
import ProductDeatilsCard from "@/app/components/cards/ProductDeatilsCard";

const ProductDetails = () => {
  const { id } = useParams();
  const { getProductDeatils, productDetails } = useProductContext();
  const { isOpen } = usePrescriptionContext();
  const details = productDetails?.medicine || [];
  console.log(details);

  useEffect(() => {
    if (id) getProductDeatils(id);
  }, [id]);

  if (!details?.id) {
    return (
      <div className="p-10 text-gray-600 text-center">
        Loading product details...
      </div>
    );
  }

  const fallbackImage = "/assets/fallback.png";
  const images = details.images?.length > 0 ? details.images : [fallbackImage];

  console.log(details);

  return (
    <div className=" pb-10 min-h-screen md:mt-52 sm:mt-48 mt-40">
      <div className="responsive-mx pt-7 md:pt-11">
        <SubTitle
          paths={["Home", details?.category || "Category", details?.brandname]}
        />

        <div className="md:flex gap-10 mt-6 sm:mt-12">
          <ImageSwiper images={images} />

          <div className="w-full md:w-1/2 mt-8 md:mt-0 flex flex-col px-4 sm:px-6 md:px-0">
            <ProductDeatilsCard details={details} />
          </div>
        </div>
      </div>

      {/* Modal render here */}
      {isOpen && <Prescription />}
    </div>
  );
};

export default ProductDetails;
