import RatingStars from "../RatingStars/RatingStars";

function RelatedProducts({ image, content, ratings, name }) {
  return (
    <div className="row">
      <div className="col s4 m4">
        <img
          src={image}
          alt="Related Product"
          className="responsive-img related-product-image"
        />
      </div>
      <div className="col s8 m8">
        <span>{name}</span>
        {content.map((item, index) => (
          <div key={index} className="col s12 m12">
            <li className="list-items-related-products">{item}</li>
          </div>
        ))}
        <RatingStars rating={ratings} />
        <button className="btn-small btn-add-to-cart-checkout" type="button">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default RelatedProducts;
