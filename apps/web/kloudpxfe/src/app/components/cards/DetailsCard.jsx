import React from "react";

const DetailsCard = ({ product }) => {
  return (
    <div>
      <span className="text-color text-[10px] tracking-wide">
        {product.category}
      </span>
      <p className="font-semibold text-[10px] mt-1 tracking-wide">
        {product.title}
      </p>
      <div className="flex gap-2 items-center mt-2">
        <img
          src={product.starImg}
          alt="star"
          className="object-contain w-[40%]"
        />
        <p className="text-[10px] font-medium tracking-wide">
          ({product.reviewsCount} Reviews)
        </p>
      </div>
      <div className="flex gap-2 items-center mt-2 text-[10px] tracking-wide">
        <span className="opacity-55 line-through">
          ₹{product.originalPrice.toFixed(2)}
        </span>
        <span className="font-medium">
          ₹{product.discountedPrice.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default DetailsCard;
