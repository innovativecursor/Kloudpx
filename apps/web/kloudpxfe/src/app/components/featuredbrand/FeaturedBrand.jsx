'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import TitleSlider from '../titleslider/TitleSlider';
import useSwiperNavigation from '@/app/hooks/useSwiperNavigation';

const FeaturedBrand = () => {
    const { prevRef, nextRef, setSwiperInstance } = useSwiperNavigation();

    const brandImages = [
        '/assets/image11.png',
        '/assets/image12.png',
        '/assets/image13.png',
        '/assets/image14.png',
        '/assets/image12.png',
    ];

    return (
        <div className="responsive-mx mt-8 md:mt-24 bg-gray-200/70 rounded-xl sm:py-12 py-8 sm:px-6 px-4">
            <TitleSlider title="Featured Brands" prevRef={prevRef} nextRef={nextRef} />

            <Swiper
                loop={true}
                onSwiper={setSwiperInstance}
                modules={[Navigation]}
                breakpoints={{
                    0: { slidesPerView: 2, spaceBetween: 10 },
                    640: { slidesPerView: 3, spaceBetween: 20 },
                    768: { slidesPerView: 4, spaceBetween: 20 },
                    1024: { slidesPerView: 4, spaceBetween: 20 },
                }}
                className="mySwiper"
            >
                {brandImages.map((image, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={image}
                            alt={`Brand ${index + 1}`}
                            className="object-contain"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default FeaturedBrand;
