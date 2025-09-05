"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getAxiosCall, updateAxiosCall } from "../Axios/UniversalAxiosCalls";
import endpoints from "../config/endpoints";
import Swal from "sweetalert2";

export const PwdContext = createContext();

const PwdProvider = ({ children }) => {
  const [allPendingPwds, setAllPendingPwds] = useState([]);
  const [singlePwd, setSinglePwd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [action, setAction] = useState("");

  const getAllPendingPwds = async () => {
    const res = await getAxiosCall(endpoints.pwd.getAll);
    {
      if (res?.data?.pwd_certificates) {
        setAllPendingPwds(res.data?.pwd_certificates);
      }
    }
  };

  const getSinglePendingPwd = async (id) => {
    const res = await getAxiosCall(endpoints.pwd.getone(id));
    {
      if (res?.data?.pwd) {
        setSinglePwd(res.data?.pwd);
      }
    }
  };

  const verifyPendingPwd = async (selectedAction) => {
    const payload = {
      pwd_id: singlePwd.ID,
      status: selectedAction,
    };

    try {
      const res = await updateAxiosCall(endpoints.pwd.verify, payload);

      if (res?.status) {
        await getAllPendingPwds();
        setAction(selectedAction);
        setIsModalOpen(false);
        setIsImageZoomed(false);

        Swal.fire({
          title: "Success",
          text: res?.message || "PWD status updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });
      }
    } catch (error) {
      console.log("Error verifying PWD:", error);
    }
  };

  return (
    <PwdContext.Provider
      value={{
        getAllPendingPwds,
        allPendingPwds,
        getSinglePendingPwd,
        singlePwd,
        isModalOpen,
        setIsModalOpen,
        isImageZoomed,
        setIsImageZoomed,
        action,
        setAction,
        verifyPendingPwd,
      }}
    >
      {children}
    </PwdContext.Provider>
  );
};

export default PwdProvider;
export const usePwdContext = () => useContext(PwdContext);
