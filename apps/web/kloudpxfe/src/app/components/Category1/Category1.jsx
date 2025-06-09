"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "../ProductCard/ProductCard";

import shoesP1 from "@/assets/shoes-product-1.png";
import clothesP2 from "@/assets/clothes-product-2.png";
import clothesP3 from "@/assets/clothes-product-3.png";
import clothesP4 from "@/assets/clothes-product-4.png";
import shoesP5 from "@/assets/shoes-product-6.png";
import Slider from "react-slick";

const Category1 = () => {
  const products = [
    {
      imageUrl: clothesP2,
      productName: "Air Jordan Unisex Jacket",
      productPrice: "₹5,000",
      cancelled: "₹10,000",
      onSale: true,
    },
    {
      imageUrl: shoesP1,
      productName: "Air Jordan Flight Fleece",
      productPrice: "₹11,000",
      cancelled: "₹15,890",
      onSale: false,
    },
    {
      imageUrl: clothesP3,
      productName: "Jordan Sport Jam",
      productPrice: "₹5,995",
      cancelled: "₹8,000",
      onSale: false,
    },
    {
      imageUrl: clothesP4,
      productName: "Jordan flight MVP",
      productPrice: "₹4,905",
      cancelled: "₹7,000",
      onSale: true,
    },
    {
      imageUrl: shoesP5,
      productName: "Air Jordan 1 Low SE",
      productPrice: "₹10,295",
      cancelled: "15,789",
      onSale: false,
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
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
    <div className="new_products">
      <div className="container">
        <div className="module_wrapper">
          <div className="swiper">
            <div className="row">
              {/* <div className="col l12 s12">
                <img src={shopbyCategory} className="responsive-img" alt="" />
            
              </div> */}
            </div>
            <h3 className="block-title">
              <span>Top Products</span>
            </h3>

            <Slider {...settings}>
              {products.map((product, index) => (
                <div key={index}>
                  <ProductCard
                    imageUrl={product.imageUrl}
                    productName={product.productName}
                    productPrice={product.productPrice}
                    cancelled={product.cancelled}
                    onSale={product.onSale}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category1;
