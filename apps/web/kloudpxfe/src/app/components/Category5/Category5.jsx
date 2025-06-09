import NavigationComponent from "../NavigationComponent/NavigationComponent";
import ProductDisplayComponent from "../ProductDisplayComponent/ProductDisplayComponent";

function Category5() {
  const categories = [
    "View All",
    "Audio & Video",
    "Mobiles & Tablets",
    "Bath",
    "Garden",
    "Kitchen",
    "Publications",
  ];
  const products = [
    {
      name: "Recliner synthetic deck chair",
      brand: "OFS",
      price: "$200",
      image:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/160w/products/107/411/customizable-mug__96018.1580725362.jpg?c=1",
    },
    {
      name: "[Sample] Smith Journal 13",
      brand: "Electronics",
      price: "$400",
      image:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/80w/products/111/404/mug-today-is-a-good-day_1__54893.1580725321.jpg?c=1",
    },
    {
      name: "[Sample] Tiered Wire Basket",
      brand: "Bags",
      price: "$100",
      image:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/80w/products/97/420/brown-bear-cushion_1__24173.1580725465.jpg?c=1",
    },
    {
      name: "[Sample] Laundry Detergent",
      brand: "Speaker & Audio",
      price: "$200",
      image:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/160w/products/98/416/mug-the-best-is-yet-to-come_2__14732.1580725429.jpg?c=1",
    },
    {
      name: "[Sample] Oak Cheese Grater",
      brand: "Bags",
      price: "$50",
      image:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/160w/products/94/424/mountain-fox-vector-graphics_2__38225.1580725498.jpg?c=1",
    },
    {
      name: "[Sample] Xbox Controller",
      brand: "Gaming",
      price: "$800",
      image:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/160w/products/88/432/hummingbird-vector-graphics__17262.1580725568.jpg?c=1",
    },
  ];
  return (
    <>
      <div className="new_products">
        <div className="container">
          <div className="module_wrapper">
            <div className="swiper">
              <h3 className="block-title">
                <span>Shop All</span>
              </h3>

              <NavigationComponent categories={categories} />

              <div className="col l12">
                <ProductDisplayComponent products={products} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Category5;
