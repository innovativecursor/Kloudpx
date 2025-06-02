"use client";
import ImageSlider from "../ImageSlider/ImageSlider";

const WishListsTabContent = () => {
  // Define your image data
  const images = [
    {
      src: "https://www.shutterstock.com/image-photo/shopping-cart-filled-fresh-goods-260nw-2150048327.jpg",
      alt: "Image 1",
      caption: "Buy Groceries on Quiksie",
      slogan: "Your one-stop shop for fresh groceries!",
      align: "center-align",
      buttonCaption: "Create a List",
    },
    {
      src: "https://i.pinimg.com/originals/37/12/e4/3712e4921086beef88529eccdd522a0a.png",
      alt: "Image 2",
    },
    {
      src: "https://t4.ftcdn.net/jpg/05/89/90/83/360_F_589908398_6RaggcvYGDzFF0Oh2JAcepJHeU6XLJEZ.jpg",
      alt: "Image 3",
    },
  ];

  return (
    <div>
      <ImageSlider images={images} />
      <div className="row">
        <div className="col l3">
          <div>
            <img
              src="https://m.media-amazon.com/images/G/01/wishlist/intro/list_check_mark._CB461057757_.svg"
              alt=""
              className="wishlist-image-time"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishListsTabContent;
