'use client';
import { useRef, useEffect, useState } from 'react';

const useSwiperNavigation = () => {
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

    return {
        prevRef,
        nextRef,
        swiperInstance,
        setSwiperInstance,
    };
};

export default useSwiperNavigation;
