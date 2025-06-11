// 'use client'
// import React from 'react'

// const Category7 = () => {
//     return (
//         <div className='responsive-mx flex-between-start md:flex-row flex-col md:gap-4 gap-1 mt-8 md:mt-20'>
//             {/* Left Side */}
//             <div className='flex flex-col md:w-[70%] w-full md:gap-4 gap-1'>
//                 <div className='flex justify-between md:gap-4 gap-1'>
//                     <img
//                         src="/assets/category1.png"
//                         alt="Category 1"
//                         className=" w-[60%]  h-[220px] rounded-md"
//                     />
//                     <img
//                         src="/assets/category2.png"
//                         alt="Category 2"
//                         className=" w-[40%]  h-[220px] rounded-md"
//                     />
//                 </div>
//                 <div className='flex justify-between md:gap-4 gap-1'>
//                     <img
//                         src="/assets/category3.png"
//                         alt="Category 3"
//                         className=" w-[40%] h-[220px] rounded-md"
//                     />
//                     <img
//                         src="/assets/catgory4.png"
//                         alt="Category 4"
//                         className="w-[60%] h-[220px] rounded-md"
//                     />
//                 </div>
//             </div>

//             {/* Right Side */}
//             <div className='md:w-[30%] w-full'>
//                 <img
//                     src="/assets/category5.png"
//                     alt="Category 5"
//                     className="object-cover w-full h-full min-h-[452px] rounded-md"
//                 />
//             </div>
//         </div>
//     )
// }

// export default Category7












'use client'
import React from 'react'

const Category7 = () => {
    return (
        <div className='responsive-mx flex flex-col md:flex-row gap-3 md:gap-4 mt-8 md:mt-20'>
            <div className='grid grid-cols-2 gap-3 md:gap-4 md:w-[70%]'>

                <div className='col-span-2 sm:col-span-1 h-[160px] sm:h-[220px]'>
                    <img
                        src="/assets/category1.png"
                        alt="Category 1"
                        className="w-full h-full rounded-md"
                    />
                </div>
                <div className='col-span-2 sm:col-span-1 h-[160px] sm:h-[220px]'>
                    <img
                        src="/assets/category2.png"
                        alt="Category 2"
                        className="w-full h-full rounded-md"
                    />
                </div>


                <div className='col-span-2 sm:col-span-1 h-[160px] sm:h-[220px]'>
                    <img
                        src="/assets/category3.png"
                        alt="Category 3"
                        className="w-full h-full  rounded-md"
                    />
                </div>
                <div className='col-span-2 sm:col-span-1 h-[160px] sm:h-[220px]'>
                    <img
                        src="/assets/catgory4.png"
                        alt="Category 4"
                        className="w-full h-full  rounded-md"
                    />
                </div>
            </div>


            <div className='h-[300px] md:h-auto md:w-[30%]'>
                <img
                    src="/assets/category5.png"
                    alt="Category 5"
                    className="w-full h-full  rounded-md"
                />
            </div>
        </div>
    )
}

export default Category7