"use client";
import React, { useEffect, useState } from "react";
import { useCartContext } from "@/app/contexts/CartContext";
import { useCheckout } from "@/app/contexts/CheckoutContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Clinics from "../Clinics/Clinics";
import Doctors from "../Doctors/Doctors";
import usePageLoader from "@/app/hooks/usePageLoader";
import SaveForLater from "../SaveForLater/SaveForLater";
import { useDoctorClinicsContext } from "@/app/contexts/DoctorClinicsContext";

const CheckoutContent = ({ setSelectedProduct, cartItems }) => {
  const { token } = useAuth();
  const router = useRouter();
  const { getAllCartData } = useCartContext();
  const {
    getAllClinics,
    getAllDoctors,
    allClinics,
    allDoctors,
    handleSendClinicsDoctors,
  } = useDoctorClinicsContext();
  const { savedForLaterIds, doCheckout } = useCheckout();
  const [agreedTerms, setAgreedTerms] = useState(false);
  const { startLoader } = usePageLoader();
  const data = cartItems || [];

  useEffect(() => {
    if (token) {
      getAllCartData();
    }
  }, [token]);

  const handleCheckout = async () => {
    if (!agreedTerms) {
      toast.error(
        "Please agree with the Terms and Conditions before checkout."
      );
      return;
    }
    const allItemsSavedForLater = data.every((item) =>
      savedForLaterIds.includes(item.cart_id)
    );

    if (data.length === 0 || allItemsSavedForLater) {
      toast.error(
        "No items available for checkout. Please move items back from 'Save for Later'."
      );
      return;
    }

    try {
      startLoader();
      await doCheckout();
      router.push("/Address");
    } catch (error) {
      toast.error("Checkout failed, please try again.");
    }
  };

  useEffect(() => {
    if (!allClinics?.length) {
      getAllClinics();
    }
  }, []);

  useEffect(() => {
    if (!allDoctors?.length) {
      getAllDoctors();
    }
  }, []);

  return (
    <div>
      <div className="bg-[#EDF4F6] shadow-md sm:p-6 p-5 rounded-lg mb-7 mt-9">
        <h3 className="font-semibold text-center dark-text tracking-wider sm:text-base text-sm dark-text">
          {data.length} item{data.length !== 1 && "s"} in your cart
        </h3>
      </div>

      <Clinics />
      <Doctors />
      <SaveForLater data={data} setSelectedProduct={setSelectedProduct} />

      <div className="flex items-center gap-3 mt-5">
        <label className="relative flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreedTerms}
            onChange={async (e) => {
              const checked = e.target.checked;
              setAgreedTerms(checked);
              if (checked) {
                await handleSendClinicsDoctors(data);
              }
            }}
            className="sr-only"
          />

          <span
            className={`w-5 h-5 flex-shrink-0 rounded-md border-2 border-gray-300 flex items-center justify-center transition-colors duration-200 ${
              agreedTerms ? "bg-blue-600 border-blue-600" : "bg-white"
            }`}
          >
            {agreedTerms && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </span>

          <span className="ml-2 text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200">
            I agree with the{" "}
            <span className="text-blue-600 underline">
              Terms and Conditions
            </span>
          </span>
        </label>
      </div>

      <div className="flex justify-between sm:flex-row flex-col-reverse gap-5 sm:mt-10 mt-8 items-center">
        <div className="sm:w-[40%] w-full">
          <button
            className="bg-[#0070BA]/10 text-black hover:bg-[#005c96]/20 w-full h-12 border-2 border-gray-200 shadow rounded-full font-medium
             text-sm cursor-pointer"
            onClick={() => router.push("/")}
          >
            Continue to Shop
          </button>
        </div>
        <div className="sm:w-[60%] w-full">
          <button
            className={`bg-[#0070BA] text-white hover:bg-[#005c96] text-sm w-full h-12 border-2 border-gray-200 shadow rounded-full font-semibold ${
              data.length === 0 ||
              data.every((item) => savedForLaterIds.includes(item.cart_id)) ||
              !agreedTerms
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={
              data.length === 0 ||
              data.every((item) => savedForLaterIds.includes(item.cart_id))
                ? null
                : handleCheckout
            }
            disabled={
              data.length === 0 ||
              data.every((item) => savedForLaterIds.includes(item.cart_id))
            }
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutContent;
