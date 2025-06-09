import Link from "next/link";

function BrowseCard({ cancelledPrice, title, originalPrice, image, onSale }) {
  return (
    <>
      <Link to={"/product-description"}>
        <div className="product_widget browse-card">
          <div className="card">
            {onSale && (
              <div className="sal">
                <span className="sale-text">On sale!</span>
              </div>
            )}
            <div className="image_wrapper">
              <Link className="card-image" href="#">
                <img src={image} alt="" />
              </Link>
              <button
                className="btn btn_favourite click-trigger-assigned"
                data-id="Y2NSVzNDUEFrRElnVCtFcGUxK3hCdz09"
              >
                <i className="material-symbols-outlined browse-card-fav-icon">
                  favorite
                </i>
              </button>
            </div>
            <div className="card-action">
              <div className="truncate">
                <Link href="#">{title}</Link>
              </div>
              <div className="product_price">
                <div className="product_price_wrapper">
                  <span className="price">{originalPrice}</span>
                  <del>{cancelledPrice}</del>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

export default BrowseCard;
