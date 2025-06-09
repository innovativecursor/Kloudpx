import { useEffect } from "react";
import QuantitySelector from "../QuantitySelector/QuantitySelector";
import M from "materialize-css";
function CartProduct({
  title,
  author,
  onChangeQuantity,
  quantity,
  soldBy,
  imageUrl,
  productPrice,
}) {
  const handleQuantityChange = (e) => {
    console.log(e.target.value);
  };

  useEffect(() => {
    // Initialize Materialize dropdown
    const dropdowns = document.querySelectorAll(".dropdown-trigger");
    M.Dropdown.init(dropdowns, {});
  }, []);
  return (
    <div className="card card-box">
      <div className="row">
        {/* Image Column */}
        <div className="col l3 m6 s12">
          <div className="card-image">
            <img
              className="responsive-img image-product-cart"
              src={imageUrl}
              alt={title}
            />
          </div>
        </div>

        {/* Contents Column */}
        <div className="col l6 m6 s12">
          <div className="card-content">
            <span className="card-title cart-product-title">{title}</span>
            <p className="cart-product-title cart-product-author">
              by {author}
            </p>

            <div className="quantity-soldby-div col l10 s12">
              <p>
                <QuantitySelector onChange={onChangeQuantity} />
              </p>
              <div className="card-action remove-btn-cart-product">
                <button className="btn btn-primary btn-cart-remove">
                  Remove<i className="material-icons">delete</i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col s1 m2">
          <div className="card-price-tags">
            <div className="card-heading-price-tags">
              <h6 className="card-heading-title">Price</h6>
            </div>
            <div className="card-price-">
              <div className="price-content">
                {/* <span className="zero-placement">.00</span> */}
                <p className="final-price">₹{productPrice}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartProduct;
