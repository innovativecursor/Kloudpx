// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import SubTitle from "@/app/components/Titles/SubTitle";
// import ImageSwiper from "@/app/components/ImageSwiper/ImageSwiper";
// import QuantitySelector from "@/app/components/QuantitySelector/QuantitySelector";
// import SocialIcons from "@/app/components/SocialIcons/SocialIcons";
// import { useProductContext } from "@/app/contexts/ProductContext";
// import { useCartContext } from "@/app/contexts/CartContext";
// import { usePrescriptionContext } from "@/app/contexts/PrescriptionContext";
// import toast from "react-hot-toast";
// import Prescription from "@/app/components/modal/Prescription";

// const ProductDetails = () => {
//   const { id } = useParams();
//   const router = useRouter();
// const { uploadedImage } = usePrescriptionContext(); 
//   const { getProductDeatils, productDetails } = useProductContext();
//   const { addToCart, getQuantity } = useCartContext();
//    const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);

//   useEffect(() => {
//     if (id) getProductDeatils(id);
//   }, [id]);

//   if (!productDetails?.id) {
//     return (
//       <div className="p-10 text-gray-600 text-center">
//         Loading product details...
//       </div>
//     );
//   }

//   const handleAddToCartClick = () => {
//     if (productDetails.prescription) {
//       setIsPrescriptionOpen(true); // Modal open karo
//       return;
//     }
//     const qty = getQuantity(productDetails.id);
//     addToCart(productDetails.id, qty);
//   };
//   console.log(productDetails);

//   const fallbackImage = "/assets/demo.jpg";
//   const images =
//     productDetails.images?.length > 0 ? productDetails.images : [fallbackImage];

//   const price = Number(productDetails?.price);
//   const discountPercent = Number(productDetails?.discount || 0);
//   const discountedPrice = price - (price * discountPercent) / 100;

//   return (
//     <div className="bg-gray-100 pb-10 min-h-screen">
//       <div className="responsive-mx pt-7 md:pt-11">
//         <SubTitle
//           paths={[
//             "Home",
//             productDetails?.category || "Category",
//             productDetails?.brandname,
//           ]}
//         />

//         <div className="md:flex gap-10 mt-6 sm:mt-12">
//           {/* Image Swiper */}
//           <ImageSwiper images={images} discount={discountPercent} />

//           {/* Product Info */}
//           <div className="w-full md:w-1/2 mt-8 md:mt-0 flex flex-col px-4 sm:px-6 md:px-0">
//             <div className="flex items-start gap-8">
//               <h2 className="sm:text-4xl text-2xl font-extrabold text-gray-900 mb-3">
//                 {productDetails?.genericname || "General Medicine"}
//               </h2>
//               <SocialIcons />
//             </div>

//             <h1 className="text-xl font-semibold text-gray-700 mb-2">
//               {productDetails?.brandname} {productDetails?.power}
//             </h1>

//             <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg text-justify">
//               {productDetails?.description || "No description available."}
//             </p>

//             <div className="flex items-center gap-3 mb-2">
//               {price ? (
//                 discountPercent > 0 ? (
//                   <>
//                     <span className="text-xl font-semibold text-green-600">
//                       ₹{discountedPrice.toFixed(2)}
//                     </span>
//                     <span className="opacity-55 line-through -mt-2">
//                       ₹{price.toFixed(2)}
//                     </span>
//                   </>
//                 ) : (
//                   <span className="text-xl font-semibold text-green-600">
//                     ₹{price.toFixed(2)}
//                   </span>
//                 )
//               ) : (
//                 <span className="text-red-500">Price not available</span>
//               )}
//             </div>

//             <QuantitySelector medicineid={productDetails.id} />

//             <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
//  <button
//         className="w-full sm:flex-1 flex items-center justify-center gap-3 bg-[#0070ba] hover:to-blue-600 text-white font-semibold text-base px-8 py-3 rounded-full cursor-pointer shadow-lg transition-transform transform hover:scale-105 active:scale-95"
//         onClick={handleAddToCartClick}
//       >
//         <i className="ri-shopping-cart-line text-xl"></i>
//         Add to Cart
//       </button>

//             </div>
//           </div>
//         </div>
//       </div>
//       <Prescription isOpen={isPrescriptionOpen} onClose={() => setIsPrescriptionOpen(false)} />
//     </div>
//   );
// };

// export default ProductDetails;























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

const ProductDetails = () => {
  const { id } = useParams();
  const { getProductDeatils, productDetails } = useProductContext();
  // const { addToCart, getQuantity } = useCartContext();
  const { isOpen, } = usePrescriptionContext();

  useEffect(() => {
    if (id) getProductDeatils(id);
  }, [id]);

  if (!productDetails?.id) {
    return <div className="p-10 text-gray-600 text-center">Loading product details...</div>;
  }

  // const handleAddToCartClick = () => {
  //   if (productDetails.prescription) {
  //     setIsOpen(true); 
  //     return;
  //   }
  //   const qty = getQuantity(productDetails.id);
  //   addToCart(productDetails.id, qty);
  // };

  const fallbackImage = "/assets/demo.jpg";
  const images = productDetails.images?.length > 0 ? productDetails.images : [fallbackImage];

  const price = Number(productDetails?.price);
  const discountPercent = Number(productDetails?.discount || 0);
  const discountedPrice = price - (price * discountPercent) / 100;

  return (
    <div className="bg-gray-100 pb-10 min-h-screen">
      <div className="responsive-mx pt-7 md:pt-11">
        <SubTitle
          paths={["Home", productDetails?.category || "Category", productDetails?.brandname]}
        />

        <div className="md:flex gap-10 mt-6 sm:mt-12">
          <ImageSwiper images={images} discount={discountPercent} />

          <div className="w-full md:w-1/2 mt-8 md:mt-0 flex flex-col px-4 sm:px-6 md:px-0">
            <div className="flex items-start gap-8">
              <h2 className="sm:text-4xl text-2xl font-extrabold text-gray-900 mb-3">
                {productDetails?.genericname || "General Medicine"}
              </h2>
              <SocialIcons />
            </div>

            <h1 className="text-xl font-semibold text-gray-700 mb-2">
              {productDetails?.brandname} {productDetails?.power}
            </h1>

            <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg text-justify">
              {productDetails?.description || "No description available."}
            </p>

            <div className="flex items-center gap-3 mb-2">
              {price ? (
                discountPercent > 0 ? (
                  <>
                    <span className="text-xl font-semibold text-green-600">
                      ₹{discountedPrice.toFixed(2)}
                    </span>
                    <span className="opacity-55 line-through -mt-2">₹{price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-xl font-semibold text-green-600">
                    ₹{price.toFixed(2)}
                  </span>
                )
              ) : (
                <span className="text-red-500">Price not available</span>
              )}
            </div>

            <QuantitySelector medicineid={productDetails.id} />

            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
              {/* <button
                className="w-full sm:flex-1 flex items-center justify-center gap-3 bg-[#0070ba] hover:to-blue-600 text-white font-semibold text-base px-8 py-3 rounded-full cursor-pointer shadow-lg transition-transform transform hover:scale-105 active:scale-95"
                onClick={handleAddToCartClick}
              >
                <i className="ri-shopping-cart-line text-xl"></i>
                Add to Cart
              </button> */}
              <AddToCart productDetails={productDetails} title="Add To Cart" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal render here */}
      {isOpen && <Prescription />}
    </div>
  );
};

export default ProductDetails;
