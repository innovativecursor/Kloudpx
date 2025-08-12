"use client";
import Hero from "@/app/components/Hero/Hero";
import Products from "@/app/components/Products/Products";
import HomeFloatingBtn from "@/app/components/HomeFloatingBtn/HomeFloatingBtn";
import Banners from "../components/Banners/Banners";
import Video from "../components/Videos/Video";
import Upload from "../components/upload/Upload";
import Instructions from "../components/Instructions/Instructions";
// import DeliveryHome from "../components/DeliveryHome/DeliveryHome";
// import WhyChooseUs from "../components/WhyChooseUs/WhyChooseUs";
// import HealthArticles from "../components/healtharticles/HealthArticles";

function Home() {
  return (
    <div className="homepage">
      <div className="mt-40 md:mt-64 sm:mt-48">
        <Hero />
      </div>
      <Banners />
      <Video />
      <Upload />
      <Instructions />
      {/* <DeliveryHome /> */}
      {/* <WhyChooseUs /> */}
      {/* <HealthArticles /> */}

      {/* <Products /> */}
      <HomeFloatingBtn />
    </div>
  );
}

export default Home;
