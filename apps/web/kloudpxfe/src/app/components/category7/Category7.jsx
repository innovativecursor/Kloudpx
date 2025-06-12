'use client'
import React from 'react'
import PrimaryButton from '../button/PrimaryButton'

const Category7 = () => {
    return (
        <div className='responsive-mx flex flex-col md:flex-row gap-3 md:gap-4 mt-8 md:mt-20'>
            <div className='grid grid-cols-2 gap-3 md:gap-4 md:w-[70%]'>

                <div className='col-span-2 sm:col-span-1 h-[160px] sm:h-[220px] relative'>
                    <img src="/assets/category1.png"
                        alt="Category 1" className="w-full h-full  rounded-md" />
                    <div className="absolute top-1/2 left-6 transform -translate-y-1/2 text-sm tracking-wide">
                        <p className='text-[12px] font-normal'>Big Sale 45% OFF</p>
                        <p className="md:mt-1 font-semibold text-base">OmegaBoost 3X Formula</p>
                        <p className='text-[13px] text-red-600 font-medium mt-1'>Heart Health</p>
                        <p className='text-[10px] mt-2 w-48 opacity-50'>Support healthy cholesterol and brain function.</p>

                        <PrimaryButton title="Buy Now" className="sm:mt-4 mt-1" />
                    </div>
                </div>


                <div className='col-span-2 sm:col-span-1 h-[160px] sm:h-[220px] text-white  relative'>
                    <img src="/assets/category2.png"
                        alt="Category 1" className="w-full h-full  rounded-md" />
                    <div className="absolute top-1/2 left-6 transform -translate-y-1/2 text-sm tracking-wide">
                        <p className='text-[13px] font-normal'>New Arrival</p>
                        <p className="md:mt-1 font-semibold text-xl">Vitalpack Daily Tabs</p>
                        <p className='text-[14px] font-medium '>Multivitamins</p>
                        <p className='text-[10px] mt-2 w-32'>Complete daily wellness in one pill</p>

                        <PrimaryButton title="Buy Now" className="sm:mt-4 mt-1" />
                    </div>
                </div>


                <div className='col-span-2 sm:col-span-1 h-[160px] sm:h-[250px] relative'>
                    <img src="/assets/category3.png"
                        alt="Category 1" className="w-full h-full  rounded-md" />
                    <div className="absolute top-1/2 left-6 sm:mt-12 mt-7 transform -translate-y-1/2 text-sm tracking-wide">
                        <p className='text-[13px] font-normal'>Big sale <span className='text-green-500'>65% OFF</span></p>
                        <p className="md:mt-1 font-semibold text-lg text-red-800">NeuroMax B Complex</p>
                        <p className='text-[10px] opacity-60'>Boosts memory, energy & focus.</p>

                        <PrimaryButton title="Buy Now" className="sm:mt-3 mt-1" />
                    </div>
                </div>

                <div className='col-span-2 sm:col-span-1 h-[160px] text-white sm:h-[250px] relative'>
                    <img src="/assets/catgory4.png"
                        alt="Category 1" className="w-full h-full  rounded-md" />
                    <div className="absolute top-1/2 lg:right-6 right-2 transform -translate-y-1/2 text-sm tracking-wide">
                        <p className='text-[13px] font-normal'>Big sale 65% OFF</p>
                        <p className="md:mt-1 font-semibold text-base">GreenLife Detox Elixir</p>
                        <p className="font-semibold ">Herbal Care</p>
                        <p className='text-[10px] opacity-60 mt-1'>Cleanses liver and boosts metabolism.</p>
                        <PrimaryButton title="Buy Now" className="sm:mt-3 mt-1" />
                    </div>
                </div>
            </div>

            <div className='h-[300px] md:h-auto md:w-[30%] relative'>
                <img
                    src="/assets/category5.png"
                    alt="Category 1"
                    className="w-full h-full rounded-md object-cover"
                />
                <div className="absolute md:top-32 top-20 left-1/2  w-full transform -translate-x-1/2 -translate-y-1/2 text-center text-sm tracking-wide px-2">
                    <p className='text-[13px] font-normal'>Limited Time Deal</p>
                    <p className="md:mt-1 font-semibold text-base">FlexiJoint Support+</p>
                    <p className="font-semibold text-red-600">Joint Care</p>
                    <p className='text-[11px] opacity-60 mt-1'>Relieves stiffness and strengthens joints</p>
                    <PrimaryButton title="Buy Now" className="sm:mt-3 mt-1" />
                </div>
            </div>

        </div>
    )
}

export default Category7