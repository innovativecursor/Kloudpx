import { createContext, useContext, useState, useEffect } from "react";
import { getAxiosCall, postAxiosCall, updateAxiosCall } from "../Axios/AxiosConfig";
import endpoints from "../config/endpoints";

export const PrescriptionContext = createContext();

const PrescriptionProvider = ({ children }) => {
  const [allPrescriptions, setAllPrescriptions] = useState([]);
  const [prescriptionDetails, setPrescriptionDetails] = useState(null);
  const [prescriptionCart, setPrescriptionCart] = useState(null);

  const fetchAllPrescriptions = async () => {
    try {
      const res = await getAxiosCall(endpoints.Prescriptions.get, {}, true);
      setAllPrescriptions(res?.data || res);
    } catch (error) {
      setAllPrescriptions([]);
    }
  };

  const fetchPrescriptionsDetails = async (userid) => {
    try {
      const res = await getAxiosCall(
        `${endpoints.Prescriptions.details}/${userid}`,
        {},
        true
      );
      setPrescriptionDetails(res?.data || res);
    } catch (error) {
      setPrescriptionDetails(null);
    }
  };

  const fetchPrescriptionCartById = async (prescriptionId) => {
    try {
      const res = await getAxiosCall(
        `${endpoints.Prescriptions.getCart}/${prescriptionId}`,
        {},
        true
      );
      setPrescriptionCart(res?.data || res);
      return res;
    } catch (error) {
      console.error("Error fetching prescription cart:", error);
      setPrescriptionCart(null);
      return null;
    }
  };

  const approvePrescription = async (prescriptionId) => {
    try {
      const res = await postAxiosCall(
        `${endpoints.Prescriptions.submitPrescription}/${prescriptionId}`,
        {},
        true
      );
      return res;
    } catch (error) {
      console.error("Error approving prescription:", error);
      return null;
    }
  };



  const rejectPrescription = async (prescriptionId) => {
    try {
      const res = await updateAxiosCall(endpoints.Prescriptions.rejectPrescription, prescriptionId, {}, true);
      return res;
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  return (
    <PrescriptionContext.Provider
      value={{
        allPrescriptions,
        fetchAllPrescriptions,
        prescriptionDetails,
        fetchPrescriptionsDetails,
        prescriptionCart,
        fetchPrescriptionCartById,
        approvePrescription,
        rejectPrescription
      }}
    >
      {children}
    </PrescriptionContext.Provider>
  );
};

export const usePrescriptionContext = () => useContext(PrescriptionContext);

export default PrescriptionProvider;
