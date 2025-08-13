import { createContext, useContext, useState } from "react";
import Swal from "sweetalert2";
import { getAxiosCall, updateAxiosCall } from "../Axios/UniversalAxiosCalls";
import endpoints from "../config/endpoints";

export const OrderContext = createContext();

const OrderProvider = ({ children }) => {
  const [allOrders, setAllOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});

  const getAllOrders = async () => {
    const res = await getAxiosCall(endpoints.allorders.get);
    if (res?.data?.orders) setAllOrders(res.data.orders);
  };

  const getOrderDetails = async (orderno) => {
    const res = await getAxiosCall(endpoints.orderdetails.get(orderno));
    if (res?.data) setOrderDetails(res.data);
  };

  const updateOrder = async (orderno, payload) => {
    // console.log(payload);

    const res = await updateAxiosCall(
      endpoints.updateOrder.put(orderno),
      payload
    );
    if (res?.message) {
      Swal.fire("Success", res.message, "success");
    }
    console.log(res);

    getOrderDetails(orderno);
    getAllOrders();
  };

  return (
    <OrderContext.Provider
      value={{
        getAllOrders,
        allOrders,
        getOrderDetails,
        orderDetails,
        updateOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;
export const useOrderContext = () => useContext(OrderContext);
