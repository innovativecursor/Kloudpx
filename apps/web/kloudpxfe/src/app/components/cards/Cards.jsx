'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

import TitleSlider from '../titleslider/TitleSlider';
import AddToCart from '../button/AddToCart';
import DetailsCard from './DetailsCard';


const SwiperSlider = ({ data, title }) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [swiperInstance, setSwiperInstance] = useState(null);

    useEffect(() => {
        if (swiperInstance?.params?.navigation) {
            swiperInstance.params.navigation.prevEl = prevRef.current;
            swiperInstance.params.navigation.nextEl = nextRef.current;
            swiperInstance.navigation.init();
            swiperInstance.navigation.update();
        }
    }, [swiperInstance]);

    return (
        <div className="responsive-mx mt-8 md:mt-24">
            <TitleSlider title={title} prevRef={prevRef} nextRef={nextRef} />

            <Swiper
                loop={true}
                onSwiper={setSwiperInstance}
                modules={[Navigation]}
                breakpoints={{
                    0: { slidesPerView: 2, spaceBetween: 20 },
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    768: { slidesPerView: 3, spaceBetween: 20 },
                    1024: { slidesPerView: 5, spaceBetween: 30 },
                }}
                className="mySwiper"
            >
                {data.map(product => (
                    <SwiperSlide key={product.id}>
                        <div>
                            <div className="bg-gray-100 py-8 max-h-52 rounded-md flex items-center justify-center">
                                <img
                                    src={product.productImg}
                                    alt={product.title}
                                    className="object-contain max-w-[80%]"
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
