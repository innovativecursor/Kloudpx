import { createContext, useContext, useState } from "react";
import { getAxiosCall } from "../Axios/UniversalAxiosCalls";
import endpoints from "../config/endpoints";

export const OrderContext = createContext();

const OrderProvider = ({ children }) => {
  const [allOrders, setAllOrders] = useState([]);

  const getAllOrders = async () => {
    const res = await getAxiosCall(endpoints.allorders.get);
    console.log(res);
    if (res) {
      setAllOrders(res?.data?.orders);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        getAllOrders,
        allOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;
export const useOrderContext = () => useContext(OrderContext);
