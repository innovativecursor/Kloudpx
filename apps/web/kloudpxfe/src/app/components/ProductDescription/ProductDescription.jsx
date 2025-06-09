import { useState } from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import ProductContent from "../ProductContent/ProductContent";

function ProductDescription() {
  const [cartItems, setCartItems] = useState([]);

  const updateCart = (items) => {
    setCartItems(items);
  };
  return (
    <>
      <div className="homepage">
        <Header cartItems={cartItems} />
        <ProductContent updateCart={updateCart} cartItems={cartItems} />
        <Footer />
      </div>
    </>
  );
}

export default ProductDescription;
