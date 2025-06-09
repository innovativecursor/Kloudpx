import Category1 from "../Category1/Category1";
import Category2 from "../Category2/Category2";
import Category3 from "../Category3/Category3";
import Category4 from "../Category4/Category4";

function Products() {
  return (
    <>
      {/* <Category1 /> */}

      <Category4
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
      />

      <Category2 />

      <Category3 />
    </>
  );
}

export default Products;
