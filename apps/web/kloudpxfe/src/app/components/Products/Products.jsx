import Cards from "@/app/components/cards/Cards";
import Category7 from "@/app/components/category7/Category7";
import TrendingProducts from "@/app/components/trendingproducts/TrendingProducts";
import HealthArticles from "@/app/components/healtharticles/HealthArticles";
import Testimonial from "@/app/components/testimonial/Testimonial";
import FeaturedBrand from "@/app/components/featuredbrand/FeaturedBrand";
// import Faq from "@/app/components/FaqData/Faq";
import { useProductContext } from "@/app/contexts/ProductContext";
import { useEffect } from "react";
import { faqData } from "../FaqData/FaqData";
import Faq from "../FaqData/Faq";

function Products() {
  const {
    getTwoCategory,
    twoCategory,
    getAllPopular,
    popular,
    getAllFeature,
    feature,
  } = useProductContext();

  const firstCategory = twoCategory[0]?.medicines || [];
  const firstCategoryName = twoCategory[0]?.categoryname || null;
  const secondCategory = twoCategory[1]?.medicines || [];
  const secondCategoryName = twoCategory[1]?.categoryname || null;

  const articles = [
    {
      id: 1,
      image: "/assets/image-1.png",
      date: "24 June 2025",
      title: "5 Signs You Might Be Dehydrated (And What to Do About it)",
    },
    {
      id: 2,
      image: "/assets/image-2.png",
      date: "20 June 2025",
      title: "The Importance of Daily Walks: Boost Your Health",
    },
    {
      id: 3,
      image: "/assets/image-3.png",
      date: "18 June 2025",
      title: "Understanding Your Sleep Cycle for Better Rest",
    },
    {
      id: 4,
      image: "/assets/image.png",
      date: "15 June 2025",
      title: "Top 10 Healthy Habits for Busy People",
    },
    {
      id: 5,
      image: "/assets/image-2.png",
      date: "20 June 2025",
      title: "The Importance of Daily Walks: Boost Your Health",
    },
    {
      id: 6,
      image: "/assets/image-3.png",
      date: "18 June 2025",
      title: "Understanding Your Sleep Cycle for Better Rest",
    },
    {
      id: 7,
      image: "/assets/image.png",
      date: "15 June 2025",
      title: "Top 10 Healthy Habits for Busy People",
    },
  ];
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

  useEffect(() => {
    if (!twoCategory || twoCategory?.length === 0) {
      getTwoCategory();
    }
  }, []);

  useEffect(() => {
    getAllPopular();
    getAllFeature();
  }, []);

  return (
    <>
      <Category7 />
      {popular?.length > 0 ? (
        <div>
          <Cards data={popular} title="Popular Properties" />
        </div>
      ) : null}

      <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-28">
        <Cards data={firstCategory} title={firstCategoryName} />
      </div>

      {Array.isArray(feature) && feature?.length > 0 && (
        <div className="responsive-mx mt-12 sm:mt-16 md:mt-20 bg-gray-200/70 rounded-xl sm:py-12 py-8 sm:px-6 px-4">
          <FeaturedBrand feature={feature} />
        </div>
      )}
      <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-28">
        <Cards data={secondCategory} title={secondCategoryName} />
      </div>
      <TrendingProducts />
      <HealthArticles articles={articles} />
      <Testimonial testimonials={testimonials} />
      <Faq data={faqData} showAll={false} />
      <div className="mt-10 sm:mt-16 md:mt-20">
        <img
          src="/assets/time.png"
          alt="Upload"
          className="w-full object-contain"
        />
      </div>
    </>
  );
}

export default Products;
