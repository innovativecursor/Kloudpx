import Cards from "@/app/components/cards/Cards";
// import Category1 from "../Category1/Category1";
// import Category2 from "../Category2/Category2";
// import Category3 from "../Category3/Category3";
// import Category4 from "../Category4/Category4";
import Category7 from "@/app/components/category7/Category7";
import TrendingProducts from "@/app/components/trendingproducts/TrendingProducts";
import HealthArticles from "@/app/components/healtharticles/HealthArticles";
import Testimonial from "@/app/components/testimonial/Testimonial";
import FeaturedBrand from "@/app/components/featuredbrand/FeaturedBrand";
import Faq from "@/app/components/faq/Faq";


function Products() {

  const popularProducts = [
    {
      "id": 1,
      "productImg": "/assets/product1.png",
      "category": "Supplements, Vitamins",
      "title": "Immune Booster 1000mg Tablets",
      "starImg": "/assets/star.png",
      "rating": 2,
      "reviewsCount": 2,
      "originalPrice": 2000.2,
      "discountedPrice": 150.0
    },
    {
      "id": 2,
      "productImg": "/assets/product2.png",
      "category": "Supplements, Vitamins",
      "title": "Immune Booster 1000mg Tablets",
      "starImg": "/assets/star.png",
      "rating": 2,
      "reviewsCount": 2,
      "originalPrice": 2000.2,
      "discountedPrice": 150.0
    },
    {
      "id": 3,
      "productImg": "/assets/product3.png",
      "category": "Supplements, Vitamins",
      "title": "Immune Booster 1000mg Tablets",
      "starImg": "/assets/star.png",
      "rating": 2,
      "reviewsCount": 2,
      "originalPrice": 2000.2,
      "discountedPrice": 150.0
    },
    {
      "id": 4,
      "productImg": "/assets/product4.png",
      "category": "Supplements, Vitamins",
      "title": "Immune Booster 1000mg Tablets",
      "starImg": "/assets/star.png",
      "rating": 2,
      "reviewsCount": 2,
      "originalPrice": 2000.2,
      "discountedPrice": 150.0
    },
    {
      "id": 5,
      "productImg": "/assets/product5.png",
      "category": "Supplements, Vitamins",
      "title": "Immune Booster 1000mg Tablets",
      "starImg": "/assets/star.png",
      "rating": 2,
      "reviewsCount": 2,
      "originalPrice": 2000.2,
      "discountedPrice": 150.0
    },
    {
      "id": 6,
      "productImg": "/assets/product3.png",
      "category": "Supplements, Vitamins",
      "title": "Immune Booster 1000mg Tablets",
      "starImg": "/assets/star.png",
      "rating": 2,
      "reviewsCount": 2,
      "originalPrice": 2000.2,
      "discountedPrice": 150.0
    }
  ]
  const healthProducts = [
    {
      "id": 1,
      "productImg": "/assets/healthpro2.png",
      "category": "Supplements, Vitamins",
      "title": "Immune Booster 1000mg Tablets",
      "starImg": "/assets/star.png",
      "rating": 2,
      "reviewsCount": 2,
      "originalPrice": 2000.2,
      "discountedPrice": 150.0
    },
    {
      "id": 2,
      "productImg": "/assets/healthpro5.png",
      "category": "Supplements, Vitamins",
      "title": "Immune Booster 1000mg Tablets",
      "starImg": "/assets/star.png",
      "rating": 2,
      "reviewsCount": 2,
      "originalPrice": 2000.2,
      "discountedPrice": 150.0
    },
    {
      "id": 3,
      "productImg": "/assets/healthpro2.png",
      "category": "Supplements, Vitamins",
      "title": "Immune Booster 1000mg Tablets",
      "starImg": "/assets/star.png",
      "rating": 2,
      "reviewsCount": 2,
      "originalPrice": 2000.2,
      "discountedPrice": 150.0
    },
    {
      "id": 4,
      "productImg": "/assets/healthpro4.png",
      "category": "Supplements, Vitamins",
      "title": "Immune Booster 1000mg Tablets",
      "starImg": "/assets/star.png",
      "rating": 2,
      "reviewsCount": 2,
      "originalPrice": 2000.2,
      "discountedPrice": 150.0
    },
    {
      "id": 5,
      "productImg": "/assets/healthpro5.png",
      "category": "Supplements, Vitamins",
      "title": "Immune Booster 1000mg Tablets",
      "starImg": "/assets/star.png",
      "rating": 2,
      "reviewsCount": 2,
      "originalPrice": 2000.2,
      "discountedPrice": 150.0
    },
    {
      "id": 6,
      "productImg": "/assets/healthpro2.png",
      "category": "Supplements, Vitamins",
      "title": "Immune Booster 1000mg Tablets",
      "starImg": "/assets/star.png",
      "rating": 2,
      "reviewsCount": 2,
      "originalPrice": 2000.2,
      "discountedPrice": 150.0
    }
  ]
  const trendingProducts = [
    {
      "id": 1,
      "productImg": "/assets/product1.png",
      "title": "Immune Booster 1000mg Tablets",
      "starImg": "/assets/star.png",
      "rating": 2,
      "reviewsCount": 2,
      "originalPrice": 2000.2,
      "discountedPrice": 150.0
    },
    {
      "id": 2,
      "productImg": "/assets/product2.png",
      "title": "Immune Booster 1000mg Tablets",
      "starImg": "/assets/star.png",
      "rating": 2,
      "reviewsCount": 2,
      "originalPrice": 2000.2,
      "discountedPrice": 150.0
    },
    {
      "id": 3,
      "productImg": "/assets/product3.png",
      "title": "Immune Booster 1000mg Tablets",
      "starImg": "/assets/star.png",
      "rating": 2,
      "reviewsCount": 2,
      "originalPrice": 2000.2,
      "discountedPrice": 150.0
    },
    {
      "id": 4,
      "productImg": "/assets/product4.png",
      "title": "Immune Booster 1000mg Tablets",
      "starImg": "/assets/star.png",
      "rating": 2,
      "reviewsCount": 2,
      "originalPrice": 2000.2,
      "discountedPrice": 150.0
    },
    {
      "id": 5,
      "productImg": "/assets/product5.png",
      "title": "Immune Booster 1000mg Tablets",
      "starImg": "/assets/star.png",
      "rating": 2,
      "reviewsCount": 2,
      "originalPrice": 2000.2,
      "discountedPrice": 150.0
    },
    {
      "id": 6,
      "productImg": "/assets/product3.png",
      "title": "Immune Booster 1000mg Tablets",
      "starImg": "/assets/star.png",
      "rating": 2,
      "reviewsCount": 2,
      "originalPrice": 2000.2,
      "discountedPrice": 150.0
    },
    {
      "id": 7,
      "productImg": "/assets/product3.png",
      "title": "Immune Booster 1000mg Tablets",
      "starImg": "/assets/star.png",
      "rating": 2,
      "reviewsCount": 2,
      "originalPrice": 2000.2,
      "discountedPrice": 150.0
    },
    {
      "id": 8,
      "productImg": "/assets/product3.png",
      "title": "Immune Booster 1000mg Tablets",
      "starImg": "/assets/star.png",
      "rating": 2,
      "reviewsCount": 2,
      "originalPrice": 2000.2,
      "discountedPrice": 150.0
    },
    {
      "id": 9,
      "productImg": "/assets/product3.png",
      "title": "Immune Booster 1000mg Tablets",
      "starImg": "/assets/star.png",
      "rating": 2,
      "reviewsCount": 2,
      "originalPrice": 2000.2,
      "discountedPrice": 150.0
    }

  ]
  const articles = [
    {
      id: 1,
      image: '/assets/image-1.png',
      date: '24 June 2025',
      title: '5 Signs You Might Be Dehydrated (And What to Do About it)',
    },
    {
      id: 2,
      image: '/assets/image-2.png',
      date: '20 June 2025',
      title: 'The Importance of Daily Walks: Boost Your Health',
    },
    {
      id: 3,
      image: '/assets/image-3.png',
      date: '18 June 2025',
      title: 'Understanding Your Sleep Cycle for Better Rest',
    },
    {
      id: 4,
      image: '/assets/image.png',
      date: '15 June 2025',
      title: 'Top 10 Healthy Habits for Busy People',
    },
    {
      id: 5,
      image: '/assets/image-2.png',
      date: '20 June 2025',
      title: 'The Importance of Daily Walks: Boost Your Health',
    },
    {
      id: 6,
      image: '/assets/image-3.png',
      date: '18 June 2025',
      title: 'Understanding Your Sleep Cycle for Better Rest',
    },
    {
      id: 7,
      image: '/assets/image.png',
      date: '15 June 2025',
      title: 'Top 10 Healthy Habits for Busy People',
    },
  ];
  const testimonials = [
    {
      id: 1,
      starsImg: '/assets/star.png',
      message:
        'The Lorem Ipsum we know today is derived from parts of the first book Liber Primus and its discussion on hedonism, the words of which had been altered, added and removed to make it nonsensical and improper Latin. It is not known exactly when the text gained its current traditional form.',
      userImg: '/assets/image (11).png',
      name: 'Maria L. -- Quezon City',
      date: 'June 12, 2025',
    },
    {
      id: 2,
      starsImg: '/assets/star.png',
      message:
        'The Lorem Ipsum we know today is derived from parts of the first book Liber Primus and its discussion on hedonism, the words of which had been altered, added and removed to make it nonsensical and improper Latin. It is not known exactly when the text gained its current traditional form.',
      userImg: '/assets/image (12).png',
      name: 'John D. -- Manila',
      date: 'June 10, 2025',
    },
    {
      id: 3,
      starsImg: '/assets/star.png',
      message:
        'The Lorem Ipsum we know today is derived from parts of the first book Liber Primus and its discussion on hedonism, the words of which had been altered, added and removed to make it nonsensical and improper Latin. It is not known exactly when the text gained its current traditional form.',
      userImg: '/assets/image (13).png',
      name: 'Ana S. -- Cebu City',
      date: 'June 8, 2025',
    },
    {
      id: 4,
      starsImg: '/assets/star.png',
      message:
        'The Lorem Ipsum we know today is derived from parts of the first book Liber Primus and its discussion on hedonism, the words of which had been altered, added and removed to make it nonsensical and improper Latin. It is not known exactly when the text gained its current traditional form.',
      userImg: '/assets/image (12).png',
      name: 'Carlos M. -- Davao',
      date: 'June 6, 2025',
    },
  ];


  return (
    <>

      <Category7 />
      <Cards data={popularProducts} title="Popular Properties" />
      <FeaturedBrand />
      <Cards data={healthProducts} title="Health Products" />
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



      {/* <Category1 /> */}
      {/* <Category4
        data={[
          {
            imageUrl:
              "https://cdn11.bigcommerce.com/s-j3ehq026w9/content/site/home1/icons/icon3.png",
            paymentTitle: "FREE DELIVERY",
            paymentSubtitle: "For all orders over ₹120",
          },
          {
            imageUrl:
              "https://cdn11.bigcommerce.com/s-j3ehq026w9/content/site/home1/icons/icon2.png",
            paymentTitle: "SAFE PAYMENT",
            paymentSubtitle: "100% secure payment",
          },
          {
            imageUrl:
              "https://cdn11.bigcommerce.com/s-j3ehq026w9/content/site/home1/icons/icon4.png",
            paymentTitle: "24/7 HELP CENTER",
            paymentSubtitle: "Dedicated 24/7 support",
          },
          {
            imageUrl:
              "https://cdn11.bigcommerce.com/s-j3ehq026w9/content/site/home1/icons/icon5.png",
            paymentTitle: "FRIENDLY SERVICES",
            paymentSubtitle: "30 day satisfaction guarantee",
          },
        ]}
      /> */}
      {/* <Category2 /> */}
      {/* <Category3 /> */}
    </>
  );
}

export default Products;


