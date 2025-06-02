"use client";
import Slider from "react-slick";
import "./ContinueShoppingSection.css";
/* eslint-disable react/prop-types */
const ContinueShoppingSection = ({ items }) => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="col l12 m12">
      <div className="card review-card-shop">
        <div className="card-content">
          <h5>Continue shopping for </h5>
          <div className="row">
            {/* Map over the items array to generate item cards */}
            <Slider {...settings}>
              {items.map((item, index) => (
                <div className="col l8 m3" key={index}>
                  <div className="card card-search-bar card-mini">
                    <div className="card-content image-card-container continue-shopping-section-image">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="img-search-card"
                      />

                      <span className="img-title-card">{item.title}</span>
                      <span className="img-title-card">₹{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinueShoppingSection;
