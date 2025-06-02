import Link from "next/link";

/* eslint-disable react/prop-types */
const MobileCard = ({
  imageSrc,
  productName,
  productPrice,
  cancelledPrice,
  onSale,
}) => {
  return (
    <div
      className="swiper-slide"
      style={{ width: "240.6px", marginRight: "20px" }}
    >
      <div className="product_widget">
        {onSale && (
          <div className="sal">
            <span className="sale-text">On sale!</span>
          </div>
        )}
        <div className="card">
          <div className="image_wrapper">
            <Link className="card-image" href="#">
              <img src={imageSrc} alt="" className="responsive-img" />
            </Link>
            <button
              className="btn btn_favourite click-trigger-assigned"
              data-id="Y2NSVzNDUEFrRElnVCtFcGUxK3hCdz09"
            >
              <i className="material-symbols-outlined">favorite</i>
            </button>
          </div>
          <div className="card-action">
            <div className="truncate">
              <Link href="#">{productName}</Link>
            </div>
            <div className="product_price">
              <div className="product_price_wrapper">
                <span className="price">{productPrice}</span>
                <del>{cancelledPrice}</del>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCard;
