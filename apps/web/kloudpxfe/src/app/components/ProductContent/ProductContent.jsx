import SquareBox from "../SquareBox/SquareBox";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import M from "materialize-css";

import QuantityInput from "../QuantityInput/QuantityInput";
import { AddToCartButton } from "../AddToCartButton/AddToCartButton";
import { AddToWishlistButton } from "../AddToWishlistButton/AddToWishlistButton";
import ShowRating from "../ShowRating/ShowRating";
import { MainImage, SliderImages } from "../CarouselImage/CarouselImage";
import { useEffect, useState } from "react";
import airJordan2 from "@/assets/air-jordan-1-part2.png";
import airJordan from "@/assets/air-jordan-1.png";
import airJordan3 from "@/assets/air-jordan-1-low-g-golf-shoes-3.jpeg";
import airJordan4 from "@/assets/air-jordan-1-low-g-golf-shoes-4.png";
import airJordan5 from "@/assets/air-jordan-1-low-g-golf-shoes-5.jpeg";
import airJordan6 from "@/assets/air-jordan-1-low-g-golf-shoes-2.png";
import airJordan7 from "@/assets/air-jordan-1-low-g-golf-shoes-6.png";

import SliderCard from "../SliderCard/SliderCard";
import ModalCart from "../ModalCart/ModalCart";
import DynamicTabs from "../DynamicTabs/DynamicTabs";

import SocialIcons from "../SocialIcons/SocialIcons";

function ProductContent({ updateCart }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState({
    id: 1,
    heading: "Air Jordan 1 Low G",
    images: [
      {
        image: airJordan,
      },
      {
        image: airJordan2,
      },
      {
        image: airJordan3,
      },
      {
        image: airJordan4,
      },
      {
        image: airJordan5,
      },
      {
        image: airJordan6,
      },
      {
        image: airJordan7,
      },
    ],
    prices: [
      {
        price: "10,000",
        cancelled: "15,000",
      },
    ],
  });

  const [currentImageURL, setCurrentImageURL] = useState(
    productDetails.images[0]["image"]
  );

  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = () => {
    const newItem = {
      id: productDetails.id,
      name: productDetails.heading,
      price: productDetails.prices[0].price,
      quantity: 1,
    };
    const updatedCartItems = cartItems ? [...cartItems, newItem] : [newItem];
    setCartItems(updatedCartItems);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const collapsibleItems = [
    {
      icon: "check_circle",
      title: "Product Description",
      content: (
        <ul>
          <li className="prd-list">
            {`Top of the list would have to be Solomon Shereshevsky,
                  who remembered every single thing he’d ever come across
                  – a great skill to have when it came to party tricks,
                  but enough to send him crackers.`}
          </li>
          <li className="prd-list">
            {`And then there’s Delbert Trew who spends more time than you can
              imagine thinking about something very sharp indeed: barbed wire.`}
          </li>
          <li className="prd-list">
            {`You can’t go past Samuel Morse, either, who was a famous portrait
              painter before he gave his name to the code he invented.`}
          </li>
          <li className="prd-list">
            {`What a genius! And we’re pretty taken with Noel Turner, who was
              smart enough to get around some pretty weird New Zealand laws to
              invent a car that, for a while, was a huge success.`}
          </li>
          <li className="prd-list">
            {`As well, you’ll find stories on a cross-dressing spy, a couple of
              Sydney nerds who revolutionised modern music, court illustration,
              big wheels, the dubious science of controlling the weather and a
              whole stack of other stuff.`}
          </li>
        </ul>
      ),
      active: false,
    },
    {
      icon: (
        <>
          <i className="material-icons" style={{ color: "#ffdf00" }}>
            star
          </i>
        </>
      ),
      title: "Reviews",
      content: (
        <>
          <h6>Alan Walker</h6>
          <p>
            Now having 7pairs of atheists shoes I find I like the boots best. In
            fact the emerald boot is absolutely terrific, the color is great and
            it is the softest to touch of all my shoes. Just let me know of any
            other color boot mayed from the same leather.
          </p>
          <ShowRating />
        </>
      ),
      active: true,
      reviews: [
        {
          author: "Alan Walker",
          comment:
            "Now having 7 pairs of atheist shoes I find I like the boots best.Very uncomfortable Soul uper se pura glow dekh rha hai",
          date: "30th November 2022",

          viewPurchased: "View Purchased",
        },
        {
          author: "Jane Smith",
          comment:
            "These shoes are amazing! I've been wearing them for months now.Very uncomfortable Soul uper se pura glow dekh rha hai",

          viewPurchased: "View Purchased",
        },
        {
          author: "John Doe",
          comment:
            "These shoes are amazing! I've been wearing them for months now.Very uncomfortable Soul uper se pura glow dekh rha hai",
          date: "30th November 2022",

          viewPurchased: "View Purchased",
        },
        {
          author: "John Dave",
          comment:
            "These shoes are amazing! I've been wearing them for months now.Very uncomfortable Soul uper se pura glow dekh rha hai",
          date: "30th November 2022",

          viewPurchased: "View Purchased",
        },
      ],
      isModalOpen: false,

      handleViewMoreReviews: () => {}, // Function to open the modal for this tab
      handleCloseModal: () => {}, // Function to close the modal for this tab
    },
  ];

  const data2 = [
    {
      imageSrc:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/320w/products/111/404/mug-today-is-a-good-day_1__54893.1580725321.jpg?c=1",
      productName: "Smart Watch",
      productPrice: "₹2,500",
      cancelledPrice: "3000",
      onSale: true,
    },
    {
      imageSrc:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/320w/products/107/411/customizable-mug__96018.1580725362.jpg?c=1",
      productName: "Ipad",
      productPrice: "₹2,500",
    },
    {
      imageSrc:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/320w/products/104/415/the-adventure-begins-framed-poster__75809.1580725393.jpg?c=1",
      productName: "Portable Speaker",
      productPrice: "₹2,500",
      onSale: true,
    },
    {
      imageSrc:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/320w/products/103/397/brown-bear-printed-sweater_1__76620.1578972484.jpg?c=1",
      productName: "Bluetooth Speaker",
      productPrice: "₹2,500",
      cancelledPrice: "3000",
    },
    {
      imageSrc:
        "https://cdn11.bigcommerce.com/s-j3ehq026w9/images/stencil/320w/products/104/415/the-adventure-begins-framed-poster__75809.1580725393.jpg?c=1",
      productName: "Portable Speaker",
      productPrice: "₹2,500",
      onSale: true,
    },
  ];

  useEffect(() => {
    const tabs = document.querySelectorAll(".tabs");
    M.Tabs.init(tabs);
    const modalElems = document.querySelectorAll(".modal");
    M.Modal.init(modalElems);
  }, []);

  return (
    <>
      <div className="container">
        <Breadcrumbs title1={"Shoes"} title2={"Air Jordan LG 1 "} />
        <div className="product_description">
          <div className="row">
            <div className="col l6 m6 s12">
              <MainImage currentImageURL={currentImageURL} />
              <SliderImages
                currentImageURL={currentImageURL}
                setCurrentImageURL={setCurrentImageURL}
                images={productDetails.images}
              />
            </div>
            <div className="col l6 m6 s12">
              <h3>{productDetails.heading}</h3>

              <ShowRating />

              <div className="product_price">
                <div className="discount_percent">
                  ₹{productDetails.prices[0]["price"]}
                </div>
                <del className="grey-text text-darken-1">
                  ₹{productDetails.prices[0]["cancelled"]}
                </del>
              </div>

              <div>
                <div>Size: Required</div>
                <div style={{ display: "flex" }}>
                  <SquareBox color="red" />
                  <SquareBox color="green" />
                  <SquareBox color="blue" />
                </div>
              </div>

              <div className="product_description">
                <QuantityInput />

                <div className="action_buttons">
                  {isModalOpen && (
                    <ModalCart
                      open={isModalOpen}
                      handleClose={handleCloseModal}
                    />
                  )}
                  <LinkddToCartButton
                    onAddToCart={handleAddToCart}
                    className="btn modal-trigger"
                  />

                  <LinkddToWishlistButton />
                </div>

                <SocialIcons />
              </div>

              <DynamicTabs items={collapsibleItems} />
            </div>
          </div>
        </div>

        <h3 className="block-title-2">
          <span>You might Look this</span>
        </h3>
        <div className="row">
          <div className="col l12 m12 s12">
            <SliderCard data={data2} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductContent;
