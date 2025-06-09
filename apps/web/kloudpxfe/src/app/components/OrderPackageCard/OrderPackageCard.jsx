function OrderPackageCard({ title, content, imageUrl }) {
  return (
    <div className="card card-order">
      <div className="card-content card-content-order-package">
        <img src={imageUrl} className="order-package" alt="order-package" />
        <div>
          <h6 className="header-order-package">{title}</h6>
          <ul>
            {content.map((item, index) => (
              <li key={index} className="packages-text">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default OrderPackageCard;
