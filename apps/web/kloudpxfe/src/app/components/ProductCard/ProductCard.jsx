/* eslint-disable react/prop-types */
//

import Link from "next/link";

const ProductCard = ({
  imageUrl,
  productName,
  productPrice,
  cancelled,
  onSale,
}) => {
  return (
    <div
      className="swiper-slide swiper-slide-active"
      role="group"
      aria-label="1 / 6"
      style={{ width: "231.6px", marginRight: "20px" }}
    >
      <div className="product_widget">
        {onSale && (
          <div className="sal">
            <span className="sale-text">On sale!</span>
          </div>
        )}
        <div className="card">
          <Link href="/product-description" style={{ textDecoration: "none" }}>
            <div className="image_wrapper">
              <div className="card-image">
                <img src={imageUrl} alt={productName} />
              </div>
              <button
                className="btn btn_favourite click-trigger-assigned"
                data-id="Y2NSVzNDUEFrRElnVCtFcGUxK3hCdz09"
              >
                <i className="material-symbols-outlined">favorite</i>
              </button>
            </div>
          </Link>
          <Link to={`/product-description`} style={{ textDecoration: "none" }}>
            <div className="card-action">
              <div className="truncate">
                <Link href="/">{productName}</Link>
              </div>
              <div className="product_price">
                <div className="product_price_wrapper">
                  <span className="price">{productPrice}</span>
                  <del>{cancelled}</del>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
