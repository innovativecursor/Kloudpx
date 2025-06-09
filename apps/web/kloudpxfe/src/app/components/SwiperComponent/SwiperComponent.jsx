"use client";
/* eslint-disable react/prop-types */
import CategoryCards from "../CategoryCards/CategoryCards";

import { useState } from "react";
const SwiperComponent = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data.length - 1 : prevIndex - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === data.length - 1 ? 0 : prevIndex + 1
    );
  };
  return (
    <>
      <div className="swiper-container swiper-initialized swiper-horizontal swiper-backface-hidden">
        <div
          className="swiper-wrapper flex "
          id="swiper-wrapper-1acd29441b1877d6"
          aria-live="polite"
          style={{
            transitionDuration: "300ms",
            transform: `translate3d(-${
              (251.6 + 20) * currentIndex
            }px, 0px, 0px)`,
          }}
        >
          {data.map((item, index) => (
            <div
              key={index}
              className={`swiper-slide swiper-slide-active`}
              role="group"
              aria-label={`${index + 1} / ${data.length}`}
              style={{ width: "231.6px", marginRight: "20px" }}
            >
              <CategoryCards {...item} />
            </div>
          ))}
        </div>
        <div className="navigation">
          <div
            className={`swiper-button-prev ${
              currentIndex === 0 ? "swiper-button-disabled" : ""
            }`}
            tabIndex="0"
            role="button"
            aria-label="Previous slide"
            aria-controls="swiper-wrapper-1acd29441b1877d6"
            aria-disabled={currentIndex === 0 ? "true" : "false"}
            onClick={goToPrevSlide}
          ></div>
          <div
            className={`swiper-button-next ${
              currentIndex === data.length - 1 ? "swiper-button-disabled" : ""
            }`}
            tabIndex="-1"
            role="button"
            aria-label="Next slide"
            aria-controls="swiper-wrapper-1acd29441b1877d6"
            aria-disabled={currentIndex === data.length - 1 ? "true" : "false"}
            onClick={goToNextSlide}
          ></div>
        </div>

        <span
          className="swiper-notification"
          aria-live="assertive"
          aria-atomic="true"
        ></span>
      </div>
    </>
  );
};

export default SwiperComponent;
