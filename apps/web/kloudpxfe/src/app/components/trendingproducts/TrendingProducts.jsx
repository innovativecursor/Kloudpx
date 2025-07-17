import React, { useEffect } from "react";
import { useProductContext } from "@/app/contexts/ProductContext";
import { generateSlug } from "@/app/utils/slugify";
import { useRouter } from "next/navigation";

const TrendingProducts = ({}) => {
  const router = useRouter();
  const { getTrendingProducts, trending } = useProductContext();
  const fallbackImage = "/assets/fallback.png";
  useEffect(() => {
    getTrendingProducts();
  }, []);

  const handleclick = (id, genericname) => {
    const slug = generateSlug(genericname);
    router.push(`/Products/${slug}/${id}`);
  };

  return (
    <div className="responsive-mx mt-14 sm:mt-16 md:mt-28">
      <h2 className="sm:text-2xl text-xl font-semibold sm:mb-9 mb-6 text-[#00243F] ">
        Trending Products
      </h2>
      <div className="grid md:grid-cols-3 lg:gap-9 md:gap-8 sm:gap-6 grid-cols-2 gap-6">
        {trending.map((product) => {
          const price = parseFloat(product.price) || 0;
          const discountPercent =
            parseFloat(product.discount?.replace("%", "")) || 0;
          const hasDiscount = discountPercent > 0;
          const discountedPrice = (
            price -
            (price * discountPercent) / 100
          ).toFixed(2);
          return (
            <div
              key={product.id}
              className="flex sm:flex-row flex-col  rounded-md justify-between items-center"
            >
              <div
                onClick={() => handleclick(product?.id, product?.genericname)}
                className="border sm:w-[30%] w-full border-[#0070BA] py-3 rounded-md flex items-center justify-center"
              >
                <img
                  // src={product.productImg}
                  src={product.images?.[0] || fallbackImage}
                  alt={product.genericname || "Product Image"}
                  className="object-contain sm:max-w-[70%] max-w-[50%] "
                />
              </div>
              <div className="sm:w-[65%] w-full sm:mt-0 mt-2">
                <p className="font-semibold text-[10px] sm:mt-2 tracking-wide mt-1">
                  {product.genericname}
                </p>
                <p className="font-semibold text-[10px] sm:mt-2 tracking-wide mt-1">
                  {product.brandname}
                </p>
                <div className="flex gap-2 items-center sm:mt-2 text-[10px] tracking-wide mt-1">
                  {hasDiscount ? (
                    <>
                      <span className="opacity-55 line-through">
                        ₹{price.toFixed(2)}
                      </span>
                      <span className="font-medium text-[#0070BA]">
                        ₹{discountedPrice}
                      </span>
                    </>
                  ) : (
                    <span className="font-medium text-[#0070BA]">
                      ₹{price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingProducts;
