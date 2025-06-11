'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import TitleSlider from '../titleslider/TitleSlider';
import useSwiperNavigation from '@/hooks/useSwiperNavigation';

const Testimonial = ({ testimonials }) => {
    const { prevRef, nextRef, setSwiperInstance } = useSwiperNavigation();

    return (
        <div className="responsive-mx mt-8 md:mt-24">
            <TitleSlider title="What our customers have to say" prevRef={prevRef} nextRef={nextRef} />

            <Swiper
                loop={true}
                onSwiper={setSwiperInstance}
                modules={[Navigation]}
                breakpoints={{
                    0: { slidesPerView: 1, spaceBetween: 20 },
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    768: { slidesPerView: 3, spaceBetween: 20 },
                    1024: { slidesPerView: 3, spaceBetween: 20 },
                }}
                className="mySwiper"
            >
                {testimonials.map((item) => (
                    <SwiperSlide key={item.id}>
                        <div className="flex justify-center flex-col items-center border border-gray-200 rounded-xl p-6">
                            <img
                                src={item.starsImg}
                                alt="stars"
                                className="object-contain mt-2 w-[30%]"
                            />
                            <p className="text-[10px] opacity-60 text-center mt-3 tracking-wide">
                                "{item.message}"
                            </p>
                            <img
                                src={item.userImg}
                                alt="user"
                                className="object-contain w-[20%] mt-4"
                            />
                            <p className="tracking-wide text-[10px] font-normal mt-3">{item.name}</p>
                            <span className="text-[10px] opacity-80 mt-1">{item.date}</span>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Testimonial;
