/* eslint-disable react/prop-types */
import "./OrderCard.css";
const OrderCard = ({ imageUrl, productName, productPrice }) => {
  return (
    <div className="col l4 m6 s12 ">
      <div className="card order-card">
        <div className="card-image">
          <img src={imageUrl} alt={productName} />
        </div>
        <div className="card-content order-card-content">
          <span className="card-title order-card-title">{productName}</span>
          <p>{productPrice}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
