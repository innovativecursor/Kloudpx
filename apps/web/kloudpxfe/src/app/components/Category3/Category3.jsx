import SwiperComponent from "@/app/components/SwiperComponent/SwiperComponent";
import SwiperComponent2 from "@/app/components/SwiperComponent2/SwiperComponent2";
import grocery from "@/assets/grocery_image_1.jpg";
import ReviewCard from "@/app/components/ReviewCard/ReviewCard";
import ContinueShoppingSection from "@/app/components/ContinueShoppingSection/ContinueShoppingSection";
import MoreItemsToConsider from "@/app/components/MoreItemsToConsider/MoreItemsToConsider";
import MoreOptions from "@/app/components/MoreOptions/MoreOptions";
import Category5 from "@/app/components/Category5/Category5";
import Category6 from "@/app/components/Category6/Category6";

function Category3() {
  // Data arrays remain the same as original
  const data = [
    {
      title: "Mobile",
      image:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/320w/products/80/440/mountain-fox-notebook_1__86272.1580725616.jpg?c=1",
      link: "#",
    },
    {
      title: "Clothing & Fashion",
      image:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/160w/h/21__03278.original.jpg",
      link: "/product-description",
    },
    {
      title: "Electronics",
      image:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/320w/products/104/415/the-adventure-begins-framed-poster__75809.1580725393.jpg?c=1",
      link: "/product-description",
    },
    {
      title: "Tablets",
      image:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/320w/j/the-best-is-yet-to-come-framed-poster__84552.original.jpg",
      link: "/product-description",
    },
    {
      title: "Medicines",
      image:
        "https://www.sciencepharma.com/wp-content/uploads/2024/09/forms_drugs_baner_rf-scaled.jpg",
      link: "/product-description",
    },

    {
      title: "Furnitures",
      image:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/160w/h/29__89009.original.jpg",
      link: "/product-description",
    },

    {
      title: "Home Decor",
      image:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/320w/products/103/397/brown-bear-printed-sweater_1__76620.1578972484.jpg?c=1",
      link: "/product-description",
    },
  ];

  const data2 = [
    {
      imageSrc:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/320w/products/111/404/mug-today-is-a-good-day_1__54893.1580725321.jpg?c=1",
      productName: "Smart Watch",
      productPrice: "₹2,500",
      cancelledPrice: "3000",
    },
    {
      imageSrc:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/320w/products/107/411/customizable-mug__96018.1580725362.jpg?c=1",
      productName: "Ipad",
      productPrice: "₹2,500",
    },
    {
      imageSrc:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/640w/products/98/416/mug-the-best-is-yet-to-come_2__14732.1580725429.jpg?c=1",
      productName: "Headphones",
      productPrice: "₹2,500",
    },

    {
      imageSrc:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/320w/products/112/401/12__91162.1580551222.jpg?c=1",
      productName: "Bluetooth Speaker",
      productPrice: "₹2,500",
      cancelledPrice: "3000",
    },
    {
      imageSrc:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/320w/products/88/432/hummingbird-vector-graphics__17262.1580725568.jpg?c=1",
      productName: "Controller Xbox",
      productPrice: "₹2,500",
    },
  ];

  const videoId = "Mj0wufaHYb8";
  const imageUrl = [
    "https://m.media-amazon.com/images/I/41EfPXm9OXL._SR215,215_.jpg",
    // "https://m.media-amazon.com/images/I/41EfPXm9OXL._SR215,215_.jpg",
  ];

  const items = [
    {
      title: "Fresh Bhendi, 500g",
      price: "30",
      imageUrl:
        "https://images-eu.ssl-images-amazon.com/images/I/51yvxGKCiYL.AC_SL240_.jpg",
    },
    {
      title: "Fresh Spinach, 250g",
      price: "15",
      imageUrl:
        "https://images-eu.ssl-images-amazon.com/images/I/71J4gpncRhL.AC_SL240_.jpg",
    },
    {
      title: "Fresh Tomato - Local, 1kg",
      price: "30",
      imageUrl:
        "https://images-eu.ssl-images-amazon.com/images/I/61ZJhcdG7LL.AC_SL240_.jpg",
    },
    {
      title: "Fresh Carrot - Ooty, 50g",
      price: "22",
      imageUrl:
        "https://images-eu.ssl-images-amazon.com/images/I/81weI2ULFYL.AC_SL240_.jpg",
    },
    {
      title: "Fresh Lemon - Local, 30g",
      price: "20",
      imageUrl:
        "https://images-eu.ssl-images-amazon.com/images/I/71ptno4aB1L.AC_SL240_.jpg",
    },
    {
      title: "Fresh Capsicum - Local, 500g",
      price: "100",
      imageUrl:
        "https://images-eu.ssl-images-amazon.com/images/I/71UbN9-gk8L.AC_SL240_.jpg",
    },
  ];

  const items4 = [
    {
      title: "Fourtunes Products",
      price: "30",
      imageUrl:
        "https://images-eu.ssl-images-amazon.com/images/G/31/img18/Fresh/Mar24/Fortune_New.jpg",
    },
    {
      title: "Dawaat Products",
      price: "15",
      imageUrl:
        "https://images-eu.ssl-images-amazon.com/images/G/31/img18/Fresh/Mar24/Daawat.jpg",
    },
    {
      title: "Milky Mist Products",
      price: "30",
      imageUrl:
        "https://images-eu.ssl-images-amazon.com/images/G/31/img18/Fresh/Mar24/Milky_Mist.jpg",
    },
    {
      title: "Del-Monte Products",
      price: "22",
      imageUrl:
        "https://images-eu.ssl-images-amazon.com/images/G/31/img18/Fresh/Mar24/Delmonte.jpg",
    },
  ];

  const items2 = [
    {
      title: "Maggi 12 Packs",
      price: "100",
      imageUrl:
        "https://images-eu.ssl-images-amazon.com/images/I/817X+1rligL.AC_SL240_.jpg",
    },
    {
      title: "Chicken Nuggets",
      price: "349",
      imageUrl:
        "https://images-eu.ssl-images-amazon.com/images/I/812FKDm7hjL.AC_SL240_.jpg",
    },
    {
      title: "Kwality Wall's",
      price: "180",
      imageUrl:
        "https://images-eu.ssl-images-amazon.com/images/I/61OsGBDhLXL.AC_SL240_.jpg",
    },
    {
      title: "Sumeru Chicken Malai",
      price: "340",
      imageUrl:
        "https://images-eu.ssl-images-amazon.com/images/I/71VDoMKN8SL.AC_SL240_.jpg",
    },
    {
      title: "Prasuma Spicy Momos",
      price: "211",
      imageUrl:
        "https://images-eu.ssl-images-amazon.com/images/I/61DAOeVTmaL.AC_SL240_.jpg",
    },
    {
      title: "Kwality Wall's",
      price: "167",
      imageUrl:
        "https://images-eu.ssl-images-amazon.com/images/I/71aELqwnO6L.AC_SL240_.jpg",
    },

    // Add more items as needed
  ];

  return (
    <div className="bg-gray-50 py-8">
      {/* Top Categories Section */}
      <section className="container mx-auto px-4 mb-12">
        <div className="relative mb-8">
          <h3 className="relative text-2xl font-semibold inline-block">
            <span className="bg-gray-50 pr-4 relative z-10">
              Top Categories
            </span>
            <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300 z-0"></div>
          </h3>
        </div>
        <SwiperComponent data={data} />
      </section>

      {/* Mobiles & Tablets Section */}
      <section className="container mx-auto px-4 mb-12 ">
        <div className="relative mb-8">
          <h3 className="relative text-2xl font-semibold inline-block">
            <span className="bg-gray-50 pr-4 relative z-10">
              Mobiles & Tablets
            </span>
            <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300 z-0"></div>
          </h3>
        </div>
        <SwiperComponent2 data={data2} />
      </section>

      <Category5 />

      {/* Fresh & Groceries Section */}
      <section className="container mx-auto px-4 mb-12">
        <div className="relative mb-8">
          <h3 className="relative text-2xl font-semibold inline-block">
            <span className="bg-gray-50 pr-4 relative z-10">
              Fresh & Groceries
            </span>
            <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300 z-0"></div>
          </h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-8/12">
            <ContinueShoppingSection items={items} />
          </div>
          <div className="lg:w-4/12 flex flex-col gap-8">
            <MoreItemsToConsider videoId={videoId} items={items2} />
            <MoreOptions items={items4} />
          </div>
        </div>
      </section>

      <Category6 />

      {/* Recently Viewed Items Section */}
      <section className="container mx-auto px-4 mb-12">
        <div className="relative mb-8">
          <h3 className="relative text-2xl font-semibold inline-block">
            <span className="bg-gray-50 pr-4 relative z-10">
              Recently Viewed Items
            </span>
            <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300 z-0"></div>
          </h3>
        </div>
        <ReviewCard items={imageUrl} />
      </section>
    </div>
  );
}

export default Category3;
