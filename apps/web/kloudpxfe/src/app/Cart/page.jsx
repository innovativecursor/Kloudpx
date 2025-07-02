"use client";
import React, { useEffect } from "react";
import { useCartContext } from "../contexts/CartContext";
import QuantitySelector from "../components/QuantitySelector/QuantitySelector";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const { token } = useAuth();
  const router = useRouter();
  const { getCartData, removeFromCart } = useCartContext();
  const { data, loading } = getCartData;

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500">Loading cart...</div>
    );

  if (!data || data.length === 0)
    return (
      <div className="text-center py-10 text-gray-500">Your cart is empty.</div>
    );

  useEffect(() => {
    if (!token) {
      router.push("/home");
    }
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Your Cart
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.map((item) => (
          <div
            key={item.ID}
            className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition duration-300 flex flex-col justify-between"
          >
            {/* Image placeholder */}
            <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-gray-400">Image</span>
            </div>

            {/* Brand name */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {item.Medicine?.BrandName || "No Brand"}
            </h3>

            {/* Price and quantity info */}
            <p className="text-sm text-gray-500 mb-1">
              Price: ₹{item.Medicine?.SellingPricePerPiece || 0} / piece
            </p>
            <p className="text-sm text-gray-500 mb-1">
              Quantity: {item.Quantity}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Unit: {item.Medicine?.UnitOfMeasurement || "N/A"} Box /
              {item.Medicine?.NumberOfPiecesPerBox}
              {item.Medicine?.UnitOfMeasurement}
            </p>

            {/* Quantity Selector */}
            <QuantitySelector />

            {/* Remove Button */}
            <button
              onClick={() => removeFromCart(item.ID)}
              className="mt-4 text-sm bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartPage;
