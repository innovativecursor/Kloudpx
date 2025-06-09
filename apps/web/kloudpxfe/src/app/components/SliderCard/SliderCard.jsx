import MobileCard from "../MobileCard/MobileCard";
import { useState } from "react";

const SliderCard = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data.length - 1 : prevIndex - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === data.length - 1 ? prevIndex : prevIndex + 1
    );
  };

  return (
    <>
      <div className="swiper">
        <div className="swiper-container swiper-initialized swiper-horizontal swiper-backface-hidden">
          <div
            className="swiper-wrapper"
            id="swiper-wrapper-407b5b5746dc4c82"
            aria-live="polite"
            style={{
              transitionDuration: "300ms", // Smooth transition duration
              transform: `translate3d(-${
                (251.6 + 10) * currentIndex
              }px, 0px, 0px)`, // Adjusted for marginRight
            }}
          >
            {data.map((item, index) => (
              <MobileCard
                key={index}
                imageSrc={item.imageSrc}
                productName={item.productName}
                productPrice={item.productPrice}
                cancelledPrice={item.cancelledPrice}
                onSale={item.onSale}
              />
            ))}
          </div>
          <div className="navigation">
            <div
              className={`swiper-button-prev ${
                currentIndex === 0 ? "swiper-button-disabled" : ""
              }`}
              tabIndex="-1"
              role="button"
              aria-label="Previous slide"
              aria-controls="swiper-wrapper-407b5b5746dc4c82"
              aria-disabled={currentIndex === 0 ? "true" : "false"}
              onClick={goToPrevSlide}
            ></div>
            <div
              className={`swiper-button-next ${
                currentIndex === data.length - 1 ? "swiper-button-disabled" : ""
              }`}
              tabIndex="0"
              role="button"
              aria-label="Next slide"
              aria-controls="swiper-wrapper-407b5b5746dc4c82"
              aria-disabled={
                currentIndex === data.length - 1 ? "true" : "false"
              }
              onClick={goToNextSlide}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SliderCard;
