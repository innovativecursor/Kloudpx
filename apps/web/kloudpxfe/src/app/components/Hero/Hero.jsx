"use client";
import Slider from "react-slick";
function Hero() {
  const settings = {
    // dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };

  return (
    <>
      <main>
        <div className="hero_section">
          <div className="container">
            <Slider {...settings}>
              <div>
                <img
                  src="https://m.media-amazon.com/images/G/31/img24/March/V1/SF_Banner_1500x300_Ice-cream_store_v1._SX1500_QL85_.jpg"
                  className="responsive-img"
                  alt="Slide 1"
                />
              </div>
              <div>
                <img
                  src="https://m.media-amazon.com/images/G/31/img24/Jan/Slider/v1/V2/Meat_PC_1_2._SX1500_QL85_.jpg"
                  className="responsive-img"
                  alt="Slide 2"
                />
              </div>
              <div>
                <img
                  src="https://cms.myzow.in//images/sliders/banner-01.jpg"
                  className="responsive-img"
                  alt="Slide 3"
                />
              </div>
              <div>
                <img
                  src="https://m.media-amazon.com/images/G/31/img24/feb/Slider/V2/n3_copy_4_PC._SX1500_QL85_.jpg"
                  className="responsive-img"
                  alt="Slide 4"
                />
              </div>
              <div>
                <img
                  src="https://m.media-amazon.com/images/G/31/img24/March/HOLI/V3/SF_PC._SX1500_QL85_.jpg"
                  className="responsive-img"
                  alt=""
                />
              </div>
            </Slider>
          </div>
        </div>
      </main>
    </>
  );
}

export default Hero;
