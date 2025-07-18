import React from "react";

const DetailsCard = ({ product }) => {
  const price = Number(product?.price);

  const discountPercent = Number(product?.discount?.replace("%", "") || 0);
  const discountedPrice = price - (price * discountPercent) / 100;

  return (
    <div className="px-1">
      <p className="font-light md:text-[13px] text-[11px] md:mt-1 text-color tracking-wide capitalize">
        {(product?.genericname?.slice(0, 20) || "No genericname") +
          (product?.genericname?.length > 20 ? "..." : "")}
      </p>

      <span className="text-black font-semibold mt-1 sm:text-[12px] text-[9px] tracking-wide">
        {(product?.brandname?.slice(0, 20) || "No brandname") +
          (product?.brandname?.length > 20 ? "..." : "")}
      </span>
      <div className="flex gap-2 items-center md:mt-3 mt-2 sm:text-[15px] text-[12px] tracking-wide">
        {price ? (
          discountPercent > 0 ? (
            <>
              <span className="opacity-55 line-through">
                ₱{price.toFixed(2)}
              </span>
              <span className="font-medium">₱{discountedPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-medium">₱{price.toFixed(2)}</span>
          )
        ) : (
          <span className="text-red-500">Price not available</span>
        )}
      </div>
    </div>
  );
};

export default DetailsCard;
