"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getAxiosCall, updateAxiosCall } from "../Axios/UniversalAxiosCalls";
import endpoints from "../config/endpoints";
import Swal from "sweetalert2";

export const SeniorCitizenContext = createContext();

const SeniorCitizenProvider = ({ children }) => {
  const [allSeniorCitizen, setAllSeniorCitizen] = useState([]);
  const [singleCitizenData, setSingleCitizenData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const getAllSeniorCitizen = async () => {
    const res = await getAxiosCall(endpoints.seniorcitizen.getAll);

    {
      if (res?.data?.senior_citizens_detail) {
        setAllSeniorCitizen(res.data?.senior_citizens_detail);
      }
    }
  };

  const getSingleCitizenData = async (id) => {
    const res = await getAxiosCall(endpoints.seniorcitizen.getone(id));

    {
      if (res?.data?.senior) {
        setSingleCitizenData(res.data?.senior);
      }
    }
  };

  return (
    <SeniorCitizenContext.Provider
      value={{
        getAllSeniorCitizen,
        allSeniorCitizen,
        getSingleCitizenData,
        singleCitizenData,
        isModalOpen,
        setIsModalOpen,
        isImageZoomed,
        setIsImageZoomed,
      }}
    >
      {children}
    </SeniorCitizenContext.Provider>
  );
};

export default SeniorCitizenProvider;
export const useSeniorCitizenContext = () => useContext(SeniorCitizenContext);
