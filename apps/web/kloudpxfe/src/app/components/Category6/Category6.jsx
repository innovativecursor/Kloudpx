"use client";
import Slider from "react-slick";
import "./Category6.css";
import CategoryMiniCard from "../CategoryMiniCard/CategoryMiniCard";
import image1 from "@/assets/new_product_img_1.png";
import image2 from "@/assets/new_product_2.png";
import image3 from "@/assets/new_product_3.png";
import image4 from "@/assets/new_product_4.png";
function Category6() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 2,
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

  const miniCardsData = [
    {
      mainTitle: "#Shop All",
      subTitle: "Shop now",
      imageUrl: image1,
    },
    {
      mainTitle: "#Gaming Console",
      subTitle: "Shop Now",
      imageUrl:
        "https://m.media-amazon.com/images/I/513-6N3o0BL._AC_UY327_FMwebp_QL65_.jpg",
    },
    {
      mainTitle: "#Furniture & Decor",
      subTitle: "Shop now",
      imageUrl: image2,
    },
    {
      mainTitle: "#Smart Watch",
      subTitle: "Shop now",
      imageUrl: image3,
    },
    {
      mainTitle: "#Backpacks & Bags",
      subTitle: "Shop now",
      imageUrl: image4,
    },
  ];

  return (
    <div className="new_products">
      <div className="container">
        <div className="module_wrapper">
          <div className="swiper">
            <h3 className="block-title">
              <span>Top Categories Of the Month</span>
            </h3>

            <div className="row">
              <div className="main-category-card">
                <div className="">
                  <Slider {...settings}>
                    {miniCardsData.map((cardData, index) => (
                      <CategoryMiniCard
                        key={index}
                        mainTitle={cardData.mainTitle}
                        subTitle={cardData.subTitle}
                        imageUrl={cardData.imageUrl}
                      />
                    ))}
                  </Slider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Category6;
