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

// const ProductDetails = () => {
//   const { id } = useParams();
//   const router = useRouter();
//   const { allMedicine, selectedCategoryName, getAllMedicine } =
//     useProductContext();
//   const { addToCart, getQuantity } = useCartContext();
//   const { uploadedImage } = usePrescriptionContext();
//   const [addedToCart, setAddedToCart] = useState(false);

//   // const product = allMedicine.data.find((item) => String(item.id) === id);

//   // if (allMedicine.loading) {
//   //   return <div className="text-center p-10">Loading product...</div>;
//   // }

//   // if (!product) {
//   //   return (
//   //     <div className="p-10 text-red-600 text-center">Product Not Found</div>
//   //   );
//   // }

//   useEffect(() => {
//     getAllMedicine();
//   }, []);
//   console.log(allMedicine);

//   const handleAddToCart = async () => {
//     const quantity = getQuantity(product.id);
//     try {
//       const res = await addToCart(
//         medicineid,
//         quantity,
//         product?.prescription,
//         uploadedImage
//       );

//       if (res?.error === "insufficient_stock") {
//         toast.error(`Only ${res.available} items are available in stock.`);

//         return;
//       }

//       setAddedToCart(true);
//     } catch (error) {
//       toast.error("Cart me add karne me problem aayi");
//     }
//   };

//   const handleGoToCart = () => {
//     router.push("/Checkout");
//   };
//   const fallbackImage = "/assets/demo.jpg";
//   const images = product.images?.length > 0 ? product.images : [fallbackImage];
//   const medicineid = product.id;

//   return (
//     <div className="bg-gray-100 pb-10 min-h-screen">
//       <div className="responsive-mx pt-7 md:pt-11">
//         <SubTitle paths={["Home", selectedCategoryName, product?.brandname]} />

//         <div className="md:flex gap-10 mt-6 sm:mt-12">
//           {/* Image Swiper */}
//           <ImageSwiper images={images} />

//           {/* Product Info */}
//           <div className="w-full md:w-1/2 mt-8 md:mt-0 flex flex-col px-4 sm:px-6 md:px-0">
//             <div className="flex items-start gap-8">
//               <h1 className="sm:text-4xl text-2xl font-extrabold text-gray-900 mb-3">
//                 {product?.brandname} {product?.power}
//               </h1>
//               <SocialIcons />
//             </div>

//             <h2 className="text-xl font-semibold text-gray-700 mb-2">
//               Generic: {product?.genericname || "General Medicine"}
//             </h2>

//             {/* <div className="flex items-center gap-3 mb-6">
//               <div className="flex gap-[3px] text-yellow-400 text-xl">
//                 {[...Array(5)].map((_, i) => (
//                   <i key={i} className="ri-star-fill"></i>
//                 ))}
//               </div>
//               <span className="text-red-800 font-medium text-base">
//                 120 Reviews
//               </span>
//             </div> */}

//             <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg text-justify">
//               {product?.description || "No description available."}
//             </p>

//             <div className="flex items-center gap-3 mb-2">
//               <span className="text-2xl font-bold text-green-600">
//                 ₱{product?.price?.toFixed(2) || "N/A"}
//               </span>
//               {/* <span className="text-sm text-gray-500 line-through -mt-2">
//                 MRP ₹{(product?.price * 1.1).toFixed(2)}
//               </span> */}
//             </div>

//             {/* <div className="text-gray-700 font-semibold text-sm mb-6">
//               <span>{product?.measurementunitvalue || 1}</span>
//               <span className="mx-1">{product?.unit || "unit"}</span>
//               <span className="mx-1">/</span>
//               <span>{product?.numberofpiecesperbox || "?"} per box</span>
//             </div> */}

//             <QuantitySelector medicineid={product.id} />

//             {/* Buttons */}
//             <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
//               {addedToCart ? (
//                 <button
//                   onClick={handleGoToCart}
//                   type="button"
//                   className="w-full sm:flex-1 flex items-center justify-center gap-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-base px-8 py-3 cursor-pointer rounded-full shadow-sm transition-colors hover:border-blue-700 active:scale-95"
//                 >
//                   <i className="ri-shopping-cart-2-line text-xl"></i>
//                   Go to Cart
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleAddToCart}
//                   type="button"
//                   className="w-full sm:flex-1 flex items-center justify-center gap-3 bg-[#0070ba] hover:to-blue-600 text-white font-semibold text-base px-8 py-3 rounded-full cursor-pointer shadow-lg transition-transform transform hover:scale-105 active:scale-95"
//                 >
//                   <i className="ri-shopping-cart-line text-xl"></i>
//                   Add to Cart
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;

"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SubTitle from "@/app/components/Titles/SubTitle";
import ImageSwiper from "@/app/components/ImageSwiper/ImageSwiper";
import QuantitySelector from "@/app/components/QuantitySelector/QuantitySelector";
import SocialIcons from "@/app/components/SocialIcons/SocialIcons";
import { useProductContext } from "@/app/contexts/ProductContext";
import { useCartContext } from "@/app/contexts/CartContext";
import { usePrescriptionContext } from "@/app/contexts/PrescriptionContext";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { allMedicine, selectedCategoryName, getAllMedicine } =
    useProductContext();
  const { addToCart, getQuantity } = useCartContext();
  const { uploadedImage } = usePrescriptionContext();
  const [addedToCart, setAddedToCart] = useState(false);

  const [product, setProduct] = useState(null);

  // useEffect(() => {
  //   getAllMedicine();
  // }, []);

  useEffect(() => {
    if (id && allMedicine.length > 0) {
      const match = allMedicine.find((item) => String(item.id) === id);
      setProduct(match);
    }
  }, [allMedicine, id]);

  if (!product) {
    return (
      <div className="p-10 text-gray-600 text-center">
        Loading product details...
      </div>
    );
  }

  const handleAddToCart = async () => {
    const quantity = getQuantity(product.id);
    try {
      const res = await addToCart(
        product.id,
        quantity,
        product?.prescription,
        uploadedImage
      );

      if (res?.error === "insufficient_stock") {
        toast.error(`Only ${res.available} items are available in stock.`);
        return;
      }

      setAddedToCart(true);
    } catch (error) {
      toast.error("Problem adding to cart");
    }
  };

  const handleGoToCart = () => {
    router.push("/Checkout");
  };

  const fallbackImage = "/assets/demo.jpg";
  const images = product.images?.length > 0 ? product.images : [fallbackImage];

  return (
    <div className="bg-gray-100 pb-10 min-h-screen">
      <div className="responsive-mx pt-7 md:pt-11">
        <SubTitle paths={["Home", selectedCategoryName, product?.brandname]} />

        <div className="md:flex gap-10 mt-6 sm:mt-12">
          {/* Image Swiper */}
          <ImageSwiper images={images} />

          {/* Product Info */}
          <div className="w-full md:w-1/2 mt-8 md:mt-0 flex flex-col px-4 sm:px-6 md:px-0">
            <div className="flex items-start gap-8">
              <h1 className="sm:text-4xl text-2xl font-extrabold text-gray-900 mb-3">
                {product?.brandname} {product?.power}
              </h1>
              <SocialIcons />
            </div>

            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Generic: {product?.genericname || "General Medicine"}
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg text-justify">
              {product?.description || "No description available."}
            </p>

            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-green-600">
                ₹{product?.price?.toFixed(2) || "N/A"}
              </span>
            </div>

            <QuantitySelector medicineid={product.id} />

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
              {addedToCart ? (
                <button
                  onClick={handleGoToCart}
                  type="button"
                  className="w-full sm:flex-1 flex items-center justify-center gap-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-base px-8 py-3 cursor-pointer rounded-full shadow-sm transition-colors hover:border-blue-700 active:scale-95"
                >
                  <i className="ri-shopping-cart-2-line text-xl"></i>
                  Go to Cart
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  type="button"
                  className="w-full sm:flex-1 flex items-center justify-center gap-3 bg-[#0070ba] hover:to-blue-600 text-white font-semibold text-base px-8 py-3 rounded-full cursor-pointer shadow-lg transition-transform transform hover:scale-105 active:scale-95"
                >
                  <i className="ri-shopping-cart-line text-xl"></i>
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
