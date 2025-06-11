import React from 'react'

const DetailsCard = ({ product }) => {
    return (
        <div>
            <span className="text-color text-xs tracking-wide">{product.category}</span>
            <p className="font-semibold text-xs mt-1 tracking-wide">{product.title}</p>
            <div className="flex gap-2 items-center mt-2">
                <img
                    src={product.starImg}
                    alt="star"
                    className="object-contain w-[40%]"
                />
                <p className="text-xs font-medium tracking-wide">({product.reviewsCount} Reviews)</p>
            </div>
            <div className="flex gap-2 items-center mt-2 text-xs tracking-wide">
                <span className="opacity-55">₹{product.originalPrice.toFixed(2)}</span>
                <span className="font-medium">₹{product.discountedPrice.toFixed(2)}</span>
            </div>
        </div>
    )
}

export default DetailsCard