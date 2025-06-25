"use client";
import React from "react";
import { useParams } from "next/navigation";
import SubTitle from "@/app/components/Titles/SubTitle";
import ImageSwiper from "@/app/components/ImageSwiper/ImageSwiper";
import QuantitySelector from "@/app/components/QuantitySelector/QuantitySelector";
import SocialIcons from "@/app/components/SocialIcons/SocialIcons";
import Title from "@/app/components/Titles/Title";
import ProductsCard from "@/app/components/cards/ProductsCard";

const productsData = [
  {
    id: 1,
    title: "Complete Health Kit",
    subtitle: "Immunity Boost Collection",
    description: "Fast and effective relief",
    images: [
      "/assets/product1.png",
      "/assets/product1.png",
      "/assets/product1.png",
      "/assets/product1.png",
      "/assets/product1.png",
    ],
    likes: 32,
  },
  {
    id: 2,
    title: "Ayurvedic Cough Syrup",
    subtitle: "Respiratory Care",
    description: "Soothes sore throat quickly",
    images: [
      "/assets/product2.png",
      "/assets/product2.png",
      "/assets/product2.png",
      "/assets/product2.png",
      "/assets/product2.png",
    ],
    likes: 15,
  },
];

const products = [
  {
    id: 1,
    title: "Complete Health Kit",
    subtitle: "Immunity Boost Collection",
    description: "Fast and effective relief",
    image: "/assets/product1.png",
    likes: 32,
  },
  {
    id: 2,
    title: "Ayurvedic Cough Syrup",
    subtitle: "Respiratory Care",
    description: "Soothes sore throat quickly",
    image: "/assets/product2.png",
    likes: 15,
  },
  {
    id: 3,
    title: "Joint Pain Relief Oil",
    subtitle: "Pain Relief Essentials",
    description: "Effective for muscle & joint pain",
    image: "/assets/product3.png",
    likes: 21,
  },
  {
    id: 4,
    title: "Diabetes Care Combo",
    subtitle: "Sugar Control",
    description: "Helps manage blood sugar ",
    image: "/assets/product4.png",
    likes: 18,
  },
  {
    id: 5,
    title: "Joint Pain Relief Oil",
    subtitle: "Pain Relief Essentials",
    description: "Effective for muscle & joint pain",
    image: "/assets/product5.png",
    likes: 21,
  },
  {
    id: 6,
    title: "Diabetes Care Combo",
    subtitle: "Sugar Control",
    description: "Helps manage blood sugar ",
    image: "/assets/product4.png",
    likes: 18,
  },
];

const ProductDetails = () => {
  const params = useParams();
  const { id } = params;

  const product = productsData.find((item) => item.id === parseInt(id));

  if (!product) {
    return (
      <div className="p-10 text-red-600 text-center">Product Not Found</div>
    );
  }

  return (
    <div className="bg-gray-100 pb-10 min-h-screen">
      <div className="responsive-mx pt-7 md:pt-11">
        <SubTitle paths={["Home", "Medicine", product.title]} />

        <div className="md:flex gap-10 mt-6 sm:mt-12">
          <ImageSwiper images={product.images} />

          {/* Right side - product info */}
          <div className="w-full md:w-1/2 mt-8 md:mt-0 flex flex-col px-4 sm:px-6 md:px-0">
            <h1 className="sm:text-4xl text-2xl font-extrabold text-gray-900 mb-3">
              {product.title}
            </h1>

            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {product.subtitle}
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

            <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg">
              {product.description}
            </p>

            <div className="flex items-end gap-4 mb-2">
              <span className="text-3xl font-bold text-green-600 leading-none">
                ₹8999
              </span>
              <span className="text-base text-gray-500 line-through relative -top-1">
                ₹10000
              </span>
            </div>

            <div className="text-gray-700 font-semibold text-sm mb-6">
              Size: 6 Tablets Packs
            </div>

            <QuantitySelector />

            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
              <button
                type="button"
                className="w-full sm:flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-base px-8 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95"
              >
                <i className="ri-shopping-cart-line text-xl"></i>
                Add to Cart
              </button>

              <button
                type="button"
                className="w-full sm:flex-1 flex items-center justify-center gap-3 border-2 border-pink-500 text-pink-500 hover:bg-pink-50 font-semibold text-base px-8 py-3 rounded-full shadow-sm transition-colors hover:border-pink-600 active:scale-95"
              >
                <i className="ri-heart-line text-xl"></i>
                Wishlist
              </button>
            </div>

            <SocialIcons />
          </div>
        </div>

        {/* Related Products */}
        <div className="md:mt-20 mt-10">
          <Title text="Related Products" />
          <ProductsCard productsData={products} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
