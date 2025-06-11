import React from 'react'

const AddToCart = ({ title }) => {
    return (
        <div className='text-[9px] flex items-center gap-2 rounded-full font-medium py-2 justify-center bg-gray-200/50 cursor-pointer w-full'>
            <i className="ri-shopping-cart-line"></i>
            {title}
        </div>
    )
}

export default AddToCart