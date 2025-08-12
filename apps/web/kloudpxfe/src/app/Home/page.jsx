"use client";
import Hero from "@/app/components/Hero/Hero";
// import Products from "@/app/components/Products/Products";
import HomeFloatingBtn from "@/app/components/HomeFloatingBtn/HomeFloatingBtn";
import Banners from "../components/Banners/Banners";
import Video from "../components/Videos/Video";
import Upload from "../components/upload/Upload";
import Instructions from "../components/Instructions/Instructions";
import Otc from "../components/OTC/Otc";
import DeliveryHome from "../components/DeliveryHome/DeliveryHome";
import WhyChooseUs from "../components/WhyChooseUs/WhyChooseUs";
import HealthArticles from "../components/healtharticles/HealthArticles";
import Testimonial from "../components/testimonial/Testimonial";
import Faq from "../components/FaqData/Faq";
import { faqData } from "../components/FaqData/FaqData";

function Home() {
  const testimonials = [
    {
      id: 1,
      starsImg: "/assets/star.png",
      message:
        "The Lorem Ipsum we know today is derived from parts of the first book Liber Primus and its discussion on hedonism, the words of which had been altered, added and removed to make it nonsensical and improper Latin. It is not known exactly when the text gained its current traditional form.",
      userImg:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHAfj5_vuHuJdjhETrkbtnpfUzSNmfySGqUA&s",
      name: "Maria L. -- Quezon City",
      date: "June 12, 2025",
    },
    {
      id: 2,
      starsImg: "/assets/star.png",
      message:
        "The Lorem Ipsum we know today is derived from parts of the first book Liber Primus and its discussion on hedonism, the words of which had been altered, added and removed to make it nonsensical and improper Latin. It is not known exactly when the text gained its current traditional form.",
      userImg:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLrmn8PP7TzIV8eX-hmIDxjCX0maCla6GgFxexeSuz494RgG9l2O-YWpZnBPCVBcYU628&usqp=CAU",
      name: "John D. -- Manila",
      date: "June 10, 2025",
    },
    {
      id: 3,
      starsImg: "/assets/star.png",
      message:
        "The Lorem Ipsum we know today is derived from parts of the first book Liber Primus and its discussion on hedonism, the words of which had been altered, added and removed to make it nonsensical and improper Latin. It is not known exactly when the text gained its current traditional form.",
      userImg:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCI56rio-DbtP0aixth43jSTat_dblFtAC9V1-d2y1A3dGMk7J-bSbBamZ3F4HBadGueg&usqp=CAU",
      name: "Ana S. -- Cebu City",
      date: "June 8, 2025",
    },
    {
      id: 4,
      starsImg: "/assets/star.png",
      message:
        "The Lorem Ipsum we know today is derived from parts of the first book Liber Primus and its discussion on hedonism, the words of which had been altered, added and removed to make it nonsensical and improper Latin. It is not known exactly when the text gained its current traditional form.",
      userImg:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX-Es58QnSLqs62-kc9H0Ejm8OcorFloBT_wg3ia9P0IYFhiRLa-BuFPYq-vQ4qaEenuk&usqp=CAU",
      name: "Carlos M. -- Davao",
      date: "June 6, 2025",
    },
  ];

  return (
    <div className="homepage">
      <div className="mt-40 md:mt-64 sm:mt-48">
        <Hero />
      </div>
      <Banners />
      <Video />
      <Upload />
      <Instructions />
      <Otc />
      <DeliveryHome />
      <WhyChooseUs />
      <HealthArticles />
      <Testimonial testimonials={testimonials} />
      <Faq data={faqData} showAll={false} />
      {/* <Products /> */}
      <HomeFloatingBtn />
    </div>
  );
}

export default Home;
