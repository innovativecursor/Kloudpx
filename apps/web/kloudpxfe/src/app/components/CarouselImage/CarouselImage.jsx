/* eslint-disable react/prop-types */
import { useRef, useState } from "react";

import "./CarouselImage.css";
import ImageBadge from "../ImageBadge/ImageBadge";

function MainImage({ currentImageURL }) {
  const containerRef = useRef(null);

  const handleMouseMove = (event) => {
    const { clientX: mouseX, clientY: mouseY } = event;
    const container = containerRef.current;
    const { left, top, width, height } = container.getBoundingClientRect();
    const offsetX = (mouseX - left) / width;
    const offsetY = (mouseY - top) / height;

    container.style.backgroundPosition = `${offsetX * 100}% ${offsetY * 100}%`;
  };

  const handleMouseEnter = () => {
    containerRef.current.classList.add("zoom");
  };

  const handleMouseLeave = () => {
    containerRef.current.classList.remove("zoom");
    containerRef.current.style.backgroundPosition = "center";
  };

  return (
    <div className="carousel_wrapper">
      <div className="main_image">
        <div
          ref={containerRef}
          className="image-container responsive-img"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            backgroundImage: `url(${currentImageURL})`,
          }}
        >
          <ImageBadge title={"10% OFF"} />
        </div>
      </div>
    </div>
  );
}

function SliderImages({ images = [], currentImageURL, setCurrentImageURL }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % images?.length;
    setCurrentIndex(newIndex);
    setCurrentImageURL(images[newIndex].image);
  };

  const prevSlide = () => {
    const newIndex = (currentIndex - 1 + images?.length) % images?.length;
    setCurrentIndex(newIndex);
    setCurrentImageURL(images[newIndex].image);
  };

  return (
    <div className="row">
      <div className="col s12">
        <div className="carousel_wrapper">
          <div style={{ position: "relative", display: "flex" }}>
            <button onClick={prevSlide} className="slide_arrow prev_arrow">
              <i className="material-icons">arrow_back_ios</i>
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                overflow: "hidden",
              }}
            >
              {images.map((item, index) => (
                <div
                  key={index.toString()}
                  onClick={() => setCurrentImageURL(item.image)}
                  className={
                    "multiple-image" +
                    ` ${
                      item.image === currentImageURL
                        ? "active_image"
                        : "inactive_image"
                    }`
                  }
                >
                  <img
                    alt="Air Jordan"
                    src={item.image}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              ))}
            </div>
            <button onClick={nextSlide} className="slide_arrow next_arrow">
              <i className="material-icons">arrow_forward_ios</i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { MainImage, SliderImages };
