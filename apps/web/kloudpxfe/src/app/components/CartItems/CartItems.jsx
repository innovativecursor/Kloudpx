import CartProduct from "../CartProduct/CartProduct";
import pumaImage from "@/assets/puma_image.png";
import { useState } from "react";
import SliderCard from "../SliderCard/SliderCard";
import CheckoutAccordion from "../CheckoutAccordion/CheckoutAccordion";
import RelatedProducts from "../RelatedProducts/RelatedProducts";
function CartItems() {
  const [products, setProducts] = useState([
    {
      title: "BATMAN: METAL DIE-CAST BAT-SIGNAL",
      author: "Matthew K. Manning",
      price: "2,857",
      quantity: 1,
      soldBy: "Sunrise Book store",
      imageUrl:
        "https://c1-ebgames.eb-cdn.com.au/merchandising/images/packshots/658da15d2cee48378fee311870304ccd_Original.png",
    },
    {
      title: "Puma Unisex-Adult Flair Riding Running Shoe",
      author: "Official Puma Store",
      price: "1,499",
      quantity: 1,
      soldBy: "Official Puma Store",
      imageUrl: pumaImage,
    },
  ]);

  const handleQuantityChange = (index, newQuantity) => {
    setProducts((prevProducts) =>
      prevProducts.map((product, i) =>
        i === index ? { ...product, quantity: newQuantity } : product
      )
    );
  };

  const data2 = [
    {
      imageSrc:
        "https://m.media-amazon.com/images/I/91FYbWe+HaL._AC_AA220_.jpg",
      productName: "Peter England Jeans",
      productPrice: "₹1,500",
      cancelledPrice: "2000",
    },
    {
      imageSrc:
        "https://m.media-amazon.com/images/I/417H52XwXEL._AC_AA220_.jpg",
      productName: "Puma Mens Smash Mid-Cut",
      productPrice: "₹2,500",
    },
    {
      imageSrc: "https://m.media-amazon.com/images/I/61vIqyQ-CTL._SX679_.jpg",
      productName: "Casio Vintage Series",
      productPrice: "₹9,500",
    },
    {
      imageSrc:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/320w/products/103/397/brown-bear-printed-sweater_1__76620.1578972484.jpg?c=1",
      productName: "Bluetooth Speaker",
      productPrice: "₹2,500",
      cancelledPrice: "3000",
    },
    {
      imageSrc: "https://m.media-amazon.com/images/I/71HexKfkr0L._SX569_.jpg",
      productName: "DC Universe Batman",
      productPrice: "₹10,500",
    },
  ];

  const relatedProducts = [
    {
      product_name: "Batman: The Black Mirror",
      image:
        "https://images-eu.ssl-images-amazon.com/images/I/91iI1+iVDJL._AC_UL200_SR200,200_.jpg",
      content: ["Hardcover", "₹1,900"],
      ratings: 4,
    },
    {
      product_name: "Batman Three Jokers",
      image:
        "https://images-eu.ssl-images-amazon.com/images/I/91wWOz7QoPS._AC_UL200_SR200,200_.jpg",
      content: ["Hardcover", "₹2,900"],
      ratings: 3,
    },
  ];

  return (
    <div className="container">
      <div className="row">
        {/* Products Column */}
        <div className="col s12 m9">
          <h4 className="cartItemsBlock-heading">Shopping Cart</h4>
          {products.map((product, index) => (
            <CartProduct
              key={index}
              title={product.title}
              author={product.author}
              quantity={product.quantity}
              onChangeQuantity={(newQuantity) =>
                handleQuantityChange(index, newQuantity)
              }
              // soldBy={product.soldBy}
              imageUrl={product.imageUrl}
              productPrice={product.price}
            />
          ))}
          <div className="subtotal-items">
            <div className="subtotal-items-text">
              <span className="text-items">Subtotal (2 items) :</span>
            </div>
            <div className="subtotal-items-ranges">
              <span className="subtotal-items-price-range">₹4,356</span>
            </div>
          </div>
        </div>

        {/* Checkout Column */}
        <div className="col s10 m3">
          <h4 className="cartItemsBlock-heading">Checkout</h4>
          <div className="card">
            <div className="card-content subtotal-items-price">
              <p className="checkout-price-main-text">
                Subtotal (1 item):{" "}
                <span className="checkout-price-range">₹4,356</span>{" "}
              </p>
              <div className="card-action proceed-to-buy-action">
                <button className="btn proceed-to-buy-btn">
                  Proceed to buy
                </button>
              </div>
              <CheckoutAccordion />
            </div>
          </div>
        </div>
        <div className="col s12 m3">
          <div className="card">
            <div className="card-content related-products-list-main-card">
              <p>Customers Who Bought BATMAN METAL DIE-CAST BAT-SIGNAL: </p>

              {relatedProducts.map((product, index) => (
                <RelatedProducts
                  key={index}
                  name={product.product_name}
                  image={product.image}
                  content={product.content}
                  ratings={product.ratings}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="col s12 m12">
          <h4 className="cartItemsBlock-heading">Your Items</h4>
          <div className="chips">
            <div className="chip">Toy figures (6)</div>
            <div className="chip">{`Women's tops, T-shirts & shirts (2)`}</div>
            <div className="chip">{`Women's shorts (1)`}</div>
            <div className="chip">{`Women's competitive swimwear (2)`}</div>
            <div className="chip">{`Candles (2)`}</div>
            <div className="chip">{`Stuffed animals (1)`}</div>
          </div>
          <div className="row">
            <div className="col l12 m12 s12">
              <SliderCard data={data2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItems;
