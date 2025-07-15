import React from "react";

const DetailsCard = ({ product }) => {
  const price = Number(product?.price);

  const discountPercent = Number(product?.discount?.replace("%", "") || 0);
  const discountedPrice = price - (price * discountPercent) / 100;

  return (
    <div>
      <p className="font-light text-[12px] text-color tracking-wide capitalize">
        {product?.genericname}
      </p>

      <span className="text-black font-semibold sm:text-[11px] text-[9px] tracking-wide">
        {product?.brandname}
      </span>
      <div className="flex gap-2 items-center mt-2 text-[12px] tracking-wide">
        {price ? (
          discountPercent > 0 ? (
            <>
              <span className="opacity-55 line-through">
                ₹{price.toFixed(2)}
              </span>
              <span className="font-medium">₹{discountedPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-medium">₹{price.toFixed(2)}</span>
          )
        ) : (
          <span className="text-red-500">Price not available</span>
        )}
      </div>
    </div>
  );
};

export default DetailsCard;
