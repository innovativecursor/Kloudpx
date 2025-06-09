"use client";
import Slider from "react-slick";

const ProductDisplayComponent = ({ products }) => {
  const settings = {
    dots: true,
    infinite: true,

    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: false,

    variableWidth: true,
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
    <div className="row">
      <div className="col l3 m5 s12">
        <img
          src="https://cdn11.bigcommerce.com/s-j3ehq026w9/content/site/home1/category/1_1.jpg"
          alt=""
        />
      </div>
      <div className="col l9 m6 s12">
        <Slider {...settings}>
          {products.map((product, index) => (
            <div className="col l3 s12" key={index}>
              <div className="row">
                <div className="col l12 s12">
                  <div className="card mini-category-field">
                    <div className="card-content mini-section">
                      <div className="mini-section-1-img">
                        <img src={product.image} alt={product.name} />
                      </div>
                      <div className="mini-section-1-titles">
                        <span>{product.brand}</span>
                        <h6>{product.name}</h6>
                        <span>{product.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ProductDisplayComponent;
