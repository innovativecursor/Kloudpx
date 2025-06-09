function AddToCartButton({ onAddToCart }) {
  return (
    <button
      className="btn btn_cart btn-primary add-to-cart-btn"
      title=""
      onClick={onAddToCart}
    >
      Add to Cart
      <i className="material-icons right shopping-cart-icon">shopping_cart</i>
    </button>
  );
}

export { AddToCartButton };
