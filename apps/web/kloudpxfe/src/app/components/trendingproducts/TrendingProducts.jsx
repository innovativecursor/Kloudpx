import React from 'react'

const TrendingProducts = ({ trendingProducts }) => {
    return (
        <div className="responsive-mx mt-8 md:mt-14">
            <h2 className="sm:text-2xl text-xl font-semibold sm:mb-7 mb-5">Trending Products</h2>
            <div className='grid md:grid-cols-3 lg:gap-12 md:gap-8 sm:gap-6 grid-cols-2 gap-6'>
                {trendingProducts.map((product) => (
                    <div key={product.id} className='flex sm:flex-row flex-col  rounded-md justify-between items-center'>
                        <div className="border sm:w-[30%] w-full border-[#0070BA] py-3 rounded-md flex items-center justify-center">
                            <img
                                src={product.productImg}
                                alt={product.title}
                                className="object-contain sm:max-w-[70%] max-w-[50%] "
                            />
                        </div>
                        <div className='sm:w-[65%] w-full sm:mt-0 mt-2'>
                            <div className="flex gap-2 items-center sm:mt-2 mt-1">
                                <img
                                    src={product.starImg}
                                    alt="star"
                                    className="object-contain w-[35%]"
                                />
                                <p className="sm:text-xs text-[10px] font-medium tracking-wide">
                                    ({product.reviewsCount} Reviews)
                                </p>
                            </div>
                            <p className="font-semibold sm:text-xs text-[10px] sm:mt-2 tracking-wide mt-1">
                                {product.title}
                            </p>
                            <div className="flex gap-2 items-center sm:mt-2 sm:text-xs text-[10px] tracking-wide sm:mt-0 mt-1">
                                <span className="opacity-55">₹{product.originalPrice.toFixed(2)}</span>
                                <span className="font-medium">₹{product.discountedPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TrendingProducts
















