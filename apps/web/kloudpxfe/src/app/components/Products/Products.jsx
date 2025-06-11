import Cards from "@/app/components/cards/Cards";
// import Category1 from "../Category1/Category1";
// import Category2 from "../Category2/Category2";
// import Category3 from "../Category3/Category3";
// import Category4 from "../Category4/Category4";
import Category7 from "@/app/components/category7/Category7";
import TrendingProducts from "../trendingproducts/TrendingProducts";

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



  return (
    <>

      <Category7 />
      <Cards data={popularProducts} title="Popular Properties" />
      <Cards data={healthProducts} title="Health Products" />
      <TrendingProducts trendingProducts={trendingProducts} />


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
