"use client";
import React, { useEffect } from "react";
import "./ImageSlider.css";
const ImageSlider = ({ images }) => {
  useEffect(() => {
    // Initialize the slider plugin after the component has been rendered
    const slider = document.querySelector(".slider");
    window.M.Slider.init(slider, {});

    // Clean up the plugin when the component is unmounted
    return () => {
      const instance = window.M.Slider.getInstance(slider);
      if (instance) {
        instance.destroy();
      }
    };
  }, []); // Run this effect only once after the initial render

  return (
    <div className="slider">
      <ul className="slides">
        {images.map((image, index) => (
          <li key={index}>
            <img src={image.src} alt={image.alt} />
            <div className={`caption ${image.align}`}>
              <h3 className="slogan-color">{image.caption}</h3>
              <h5 className="slogan-color">{image.slogan}</h5>
              {image.buttonCaption && (
                <button className="btn btn-secondary">
                  {image.buttonCaption}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImageSlider;
