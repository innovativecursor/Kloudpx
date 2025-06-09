import shoesP1 from "@/assets/shoes-product-1.png";
import clothesP2 from "@/assets/clothes-product-2.png";
import shoesP5 from "@/assets/shoes-product-6.png";

import OrderCard from "../OrderCard/OrderCard";
const OrdersTabContent = () => {
  const orderCardsData = [
    {
      imageUrl: shoesP1,
      productName: "Nike Jordan Air 388",
      productPrice: "$10",
      onSale: true,
      cancelled: false,
    },
    {
      imageUrl: clothesP2,
      productName: "Unisex Jordan Jacket",
      productPrice: "$15",
      onSale: false,
      cancelled: true,
    },
    {
      imageUrl: shoesP5,
      productName: "Unisex Jordan Jacket",
      productPrice: "$15",
      onSale: false,
      cancelled: true,
    },
  ];

  return (
    <div className="row">
      <div className="col l8 m12 s12 ">
        {orderCardsData.map((cardData, index) => (
          <OrderCard key={index} {...cardData} />
        ))}
      </div>
    </div>
  );
};

export default OrdersTabContent;
