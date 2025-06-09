import { useState } from "react";

function AddToWishlistButton() {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <button
      className="btn btn_favourite add-to-cart-btn"
      onClick={handleToggleFavorite}
    >
      Add to wishlist
      {isFavorited ? (
        <i
          className="material-symbols-outlined right shopping-cart-icon"
          style={{
            fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
          }}
        >
          favorite
        </i>
      ) : (
        <i className="material-symbols-outlined right shopping-cart-icon">
          favorite
        </i>
      )}
    </button>
  );
}

export { AddToWishlistButton };
