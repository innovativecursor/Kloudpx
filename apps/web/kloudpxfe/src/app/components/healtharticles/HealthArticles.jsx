'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import TitleSlider from '../titleslider/TitleSlider';
import useSwiperNavigation from '@/app/hooks/useSwiperNavigation';

const HealthArticles = ({ articles }) => {
    const { prevRef, nextRef, setSwiperInstance } = useSwiperNavigation();

    return (
        <div className="responsive-mx mt-14 sm:mt-16 md:mt-28">
            <TitleSlider title="Health Articles" prevRef={prevRef} nextRef={nextRef} />

            <Swiper
                loop={true}
                onSwiper={setSwiperInstance}
                modules={[Navigation]}
                breakpoints={{
                    0: { slidesPerView: 2, spaceBetween: 20 },
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    768: { slidesPerView: 3, spaceBetween: 20 },
                    1024: { slidesPerView: 4, spaceBetween: 20 },
                }}
                className="mySwiper"
            >
                {articles.map((article) => (
                    <SwiperSlide key={article.id}>
                        <div>
                            <img
                                src={article.image}
                                alt="Article"
                                className="object-contain"
                            />
                            <h1 className="mt-3 tracking-wide text-[10px] opacity-80">
                                Posted on - <span className="text-color">{article.date}</span>
                            </h1>
                            <h1 className="mt-2 text-[10px] font-medium tracking-wide">
                                {article.title}
                            </h1>
                            <span className="text-[10px] underline opacity-70 tracking-wide">
                                Read more
                            </span>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HealthArticles;