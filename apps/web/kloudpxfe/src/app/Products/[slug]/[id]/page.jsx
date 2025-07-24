"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import SubTitle from "@/app/components/Titles/SubTitle";
import ImageSwiper from "@/app/components/ImageSwiper/ImageSwiper";
import { useProductContext } from "@/app/contexts/ProductContext";
import { usePrescriptionContext } from "@/app/contexts/PrescriptionContext";
import Prescription from "@/app/components/modal/Prescription";
import ProductDeatilsCard from "@/app/components/cards/ProductDeatilsCard";
import Cards from "@/app/components/cards/Cards";
import ProDetailsDes from "@/app/components/cards/ProDetailsDes";

const ProductDetails = () => {
  const { id } = useParams();
  const { getProductDeatils, productDetails } = useProductContext();
  const { isOpen } = usePrescriptionContext();
  const details = productDetails?.medicine || [];
  // console.log(details);

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
  // const images = details.images?.length > 0 ? details.images : [fallbackImage];
  const filteredImages =
    details.images?.filter((img) => img && img.trim() !== "") || [];
  const images = filteredImages.length > 0 ? filteredImages : [fallbackImage];

  const similarProduuct = productDetails?.related_medicines;

  // console.log(productDetails);

  return (
    <div className=" pb-10 min-h-screen md:mt-52 sm:mt-48 mt-36">
      <div className="responsive-mx pt-7 md:pt-11">
        <SubTitle
          paths={["Home", details?.category || "Category", details?.brandname]}
        />

        <div className="md:flex gap-10 mt-6 sm:mt-12">
          <ImageSwiper images={images} />

          <div className="w-full md:w-1/2 mt-8 md:mt-4 flex flex-col px-2 sm:px-6 md:px-0">
            <ProductDeatilsCard details={details} />
          </div>
        </div>
      </div>

      <div className="md:mt-16 sm:mt-12 mt-10 sm:px-0 px-2">
        {similarProduuct?.length > 0 ? (
          <div>
            <Cards data={similarProduuct} title="Similar Produuct" />
          </div>
        ) : null}
      </div>

      <ProDetailsDes details={details} />

      <div className="mt-10 sm:mt-16 md:mt-24">
        <img
          src="/assets/time.png"
          alt="Upload"
          className="w-full object-contain"
        />
      </div>

      {/* Modal render here */}
      {isOpen && <Prescription />}
    </div>
  );
};

export default ProductDetails;
