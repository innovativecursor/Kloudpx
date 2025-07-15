import Cards from "@/app/components/cards/Cards";
import Category7 from "@/app/components/category7/Category7";
import TrendingProducts from "@/app/components/trendingproducts/TrendingProducts";
import HealthArticles from "@/app/components/healtharticles/HealthArticles";
import Testimonial from "@/app/components/testimonial/Testimonial";
import FeaturedBrand from "@/app/components/featuredbrand/FeaturedBrand";
import Faq from "@/app/components/faq/Faq";
import { useProductContext } from "@/app/contexts/ProductContext";
import { useEffect } from "react";

function Products() {
  const { getTwoCategory, twoCategory } = useProductContext();

  const firstCategory = twoCategory[0]?.medicines || [];
  const secondCategory = twoCategory[1]?.medicines || [];

  const trendingProducts = [
    {
      id: 1,
      productImg: "/assets/product1.png",
      title: "Immune Booster 1000mg Tablets",
      starImg: "/assets/star.png",
      rating: 2,
      reviewsCount: 2,
      originalPrice: 2000.2,
      discountedPrice: 150.0,
    },
    {
      id: 2,
      productImg: "/assets/product2.png",
      title: "Immune Booster 1000mg Tablets",
      starImg: "/assets/star.png",
      rating: 2,
      reviewsCount: 2,
      originalPrice: 2000.2,
      discountedPrice: 150.0,
    },
    {
      id: 3,
      productImg: "/assets/product3.png",
      title: "Immune Booster 1000mg Tablets",
      starImg: "/assets/star.png",
      rating: 2,
      reviewsCount: 2,
      originalPrice: 2000.2,
      discountedPrice: 150.0,
    },
    {
      id: 4,
      productImg: "/assets/product4.png",
      title: "Immune Booster 1000mg Tablets",
      starImg: "/assets/star.png",
      rating: 2,
      reviewsCount: 2,
      originalPrice: 2000.2,
      discountedPrice: 150.0,
    },
    {
      id: 5,
      productImg: "/assets/product5.png",
      title: "Immune Booster 1000mg Tablets",
      starImg: "/assets/star.png",
      rating: 2,
      reviewsCount: 2,
      originalPrice: 2000.2,
      discountedPrice: 150.0,
    },
    {
      id: 6,
      productImg: "/assets/product3.png",
      title: "Immune Booster 1000mg Tablets",
      starImg: "/assets/star.png",
      rating: 2,
      reviewsCount: 2,
      originalPrice: 2000.2,
      discountedPrice: 150.0,
    },
    {
      id: 7,
      productImg: "/assets/product3.png",
      title: "Immune Booster 1000mg Tablets",
      starImg: "/assets/star.png",
      rating: 2,
      reviewsCount: 2,
      originalPrice: 2000.2,
      discountedPrice: 150.0,
    },
    {
      id: 8,
      productImg: "/assets/product3.png",
      title: "Immune Booster 1000mg Tablets",
      starImg: "/assets/star.png",
      rating: 2,
      reviewsCount: 2,
      originalPrice: 2000.2,
      discountedPrice: 150.0,
    },
    {
      id: 9,
      productImg: "/assets/product3.png",
      title: "Immune Booster 1000mg Tablets",
      starImg: "/assets/star.png",
      rating: 2,
      reviewsCount: 2,
      originalPrice: 2000.2,
      discountedPrice: 150.0,
    },
  ];
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
      userImg: "/assets/image (11).png",
      name: "Maria L. -- Quezon City",
      date: "June 12, 2025",
    },
    {
      id: 2,
      starsImg: "/assets/star.png",
      message:
        "The Lorem Ipsum we know today is derived from parts of the first book Liber Primus and its discussion on hedonism, the words of which had been altered, added and removed to make it nonsensical and improper Latin. It is not known exactly when the text gained its current traditional form.",
      userImg: "/assets/image (12).png",
      name: "John D. -- Manila",
      date: "June 10, 2025",
    },
    {
      id: 3,
      starsImg: "/assets/star.png",
      message:
        "The Lorem Ipsum we know today is derived from parts of the first book Liber Primus and its discussion on hedonism, the words of which had been altered, added and removed to make it nonsensical and improper Latin. It is not known exactly when the text gained its current traditional form.",
      userImg: "/assets/image (13).png",
      name: "Ana S. -- Cebu City",
      date: "June 8, 2025",
    },
    {
      id: 4,
      starsImg: "/assets/star.png",
      message:
        "The Lorem Ipsum we know today is derived from parts of the first book Liber Primus and its discussion on hedonism, the words of which had been altered, added and removed to make it nonsensical and improper Latin. It is not known exactly when the text gained its current traditional form.",
      userImg: "/assets/image (12).png",
      name: "Carlos M. -- Davao",
      date: "June 6, 2025",
    },
  ];

  useEffect(() => {
    if (!twoCategory || twoCategory.length === 0) {
      getTwoCategory();
    }
  }, []);

  return (
    <>
      <Category7 />
      <Cards data={firstCategory} title="Popular Properties" />
      <FeaturedBrand />
      <Cards data={secondCategory} title="Health Products" />
      <TrendingProducts trendingProducts={trendingProducts} />
      <HealthArticles articles={articles} />
      <Testimonial testimonials={testimonials} />
      <Faq />
      <div className="mt-10 md:mt-16">
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
