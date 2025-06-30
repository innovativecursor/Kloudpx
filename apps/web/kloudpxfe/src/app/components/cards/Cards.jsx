'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import TitleSlider from '../titleslider/TitleSlider';
import AddToCart from '../button/AddToCart';
import DetailsCard from './DetailsCard';
import useSwiperNavigation from "@/app/hooks/useSwiperNavigation"


const SwiperSlider = ({ data, title }) => {
    const {
        prevRef,
        nextRef,
        setSwiperInstance,
    } = useSwiperNavigation();

    return (
        <div className="responsive-mx mt-8 md:mt-24">
            <TitleSlider title={title} prevRef={prevRef} nextRef={nextRef} />

            <Swiper
                loop={true}
                onSwiper={setSwiperInstance}
                modules={[Navigation]}
                breakpoints={{
                    0: { slidesPerView: 2, spaceBetween: 20 },
                    640: { slidesPerView: 3, spaceBetween: 20 },
                    768: { slidesPerView: 4, spaceBetween: 20 },
                    1024: { slidesPerView: 5, spaceBetween: 30 },
                }}
                className="mySwiper"
            >
                {data.map(product => (
                    <SwiperSlide key={product.id}>
                        <div className=''>
                            <div className="bg-gray-100 py-8 md:max-h-48 sm:max-h-44 max-h-36 rounded-md flex items-center justify-center">
                                <img
                                    src={product.productImg}
                                    alt={product.title}
                                    className="object-contain lg:max-w-[80%] md:max-w-[70%] max-w-[60%]"
                                />
                            </div>
                            <div className="mt-2">
                                <DetailsCard product={product} />
                            </div>
                            <div className="mt-3">
                                <AddToCart title="Add To Cart" />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default SwiperSlider;
