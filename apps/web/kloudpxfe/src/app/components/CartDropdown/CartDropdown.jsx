import Link from "next/link";
import "./CartDropdown.css";

const CartDropdown = ({ cartItems }) => {
  return (
    <div className="cart-dropdown">
      {cartItems.map((item, index) => (
        <>
          <div key={index} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="cart-list-items">
              <div className="cart-item-name">
                <span className="item-name">{item.name}</span>
              </div>
              <div className="cart-item-price">
                <span className="item-price">₹{item.price}</span>
                <span className="zero-cart-dropdown">.00</span>
              </div>
            </div>
          </div>
        </>
      ))}
      {/* <div className="total-price-cart-dropdown">
        <div className="label-total-cart-dropdown">
          <span className="total-price-cart-label-dropdown">Total</span>
        </div>
        <div className="label-price-items-cart-dropdown">
          <span className="price-items-list">₹4,356</span>
        </div>
      </div> */}
      <div className="row checkout-btns">
        <Link href="/checkout">
          <div className="btn-checkout">
            <button className="btn">Check out</button>
          </div>
        </Link>
        <Link href="/cart">
          <div className="btn-view-cart">
            <button className="btn">View Cart</button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CartDropdown;
