import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuthContext } from "./AuthContext";
import endpoints from "../config/endpoints";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const PrescriptionContext = createContext();

const PrescriptionProvider = ({ children }) => {
  const navigate = useNavigate();
  const { token } = useAuthContext();
  const [prescriptions, setPrescriptions] = useState({
    data: [],
    loading: false,
    error: null,
  });

  const [prescriptionDetails, setPrescriptionDetails] = useState({
    data: [],
    loading: false,
  });

  const [prescriptionsCart, setPrescriptionsCart] = useState({
    data: null,
    loading: false,
    error: null,
  });

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const initialLengthRef = useRef(0);
  const [isCartUpdated, setIsCartUpdated] = useState(false);

  const userId = prescriptionDetails?.data?.User?.ID;
  const presId = prescriptionDetails?.data?.ID;

  console.log(presId);

  // get all prescriptions
  const fetchPrescriptions = async (status) => {
    setPrescriptions({ data: [], loading: true, error: null });

    if (!token) {
      setPrescriptions({ data: [], loading: false, error: "No auth token" });
      return;
    }

    try {
      const response = await axios.get(endpoints.Prescriptions.get, {
        params: { status },
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.status === 200) {
        setPrescriptions({
          data: response.data || [],
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      setPrescriptions({
        data: [],
        loading: false,
        error: error.message || "Unknown error",
      });
    }
  };

  // get Prescriptions details ....

  const getPrescriptionDetails = async (id) => {
    setPrescriptionDetails({ data: [], loading: true });

    if (!token) {
      setPrescriptionDetails({ data: [], loading: false });
      return;
    }

    try {
      const { data, status } = await axios.get(
        `http://localhost:10002/v1/pharmacist/prescriptions-details/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (status === 200) {
        setPrescriptionDetails({ data: data || [], loading: false });
      }
    } catch (error) {
      console.error(error.message);
      await Swal.fire({
        title: "Error",
        text: "Failed to load prescription details",
        icon: "error",
        confirmButtonText: "OK",
        focusConfirm: true,
      });
      setPrescriptionDetails((prev) => ({ ...prev, loading: false }));
    }
  };

  // searchMedicine....
  const searchMedicine = async (query) => {
    if (!query) return;
    setSearchLoading(true);
    setSearchError(null);
    try {
      const res = await axios.get(
        `http://localhost:10002/v1/pharmacist/search-medicine?query=${query}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setSearchResults(res.data || []);
    } catch (error) {
      console.error(error.message);
      setSearchError("Something went wrong while searching.");
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchPrescriptionsCart = async () => {
    if (!presId) {
      setPrescriptionsCart({
        data: null,
        loading: false,
        error: "User ID not found",
      });
      return;
    }
    setPrescriptionsCart({ data: null, loading: true, error: null });

    try {
      const response = await axios.get(
        `http://localhost:10002/v1/pharmacist/get-prescriptions-cart/${presId}`,
        {
          headers: { Authorization: token },
        }
      );

      if (response.status === 200) {
        setPrescriptionsCart({
          data: response.data || null,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      setPrescriptionsCart({
        data: null,
        loading: false,
        error: error.message || "Failed to fetch prescription cart",
      });
    }
  };

  useEffect(() => {
    fetchPrescriptionsCart();
  }, [presId]);

  useEffect(() => {
    if (Array.isArray(prescriptionsCart.data)) {
      const currentLength = prescriptionsCart.data.length;

      if (initialLengthRef.current === 0 && currentLength > 0) {
        initialLengthRef.current = currentLength;
        setIsCartUpdated(false);
      } else if (currentLength > initialLengthRef.current) {
        setIsCartUpdated(true);
      } else {
        setIsCartUpdated(false);
      }
    }
  }, [prescriptionsCart.data]);

  return (
    <PrescriptionContext.Provider
      value={{
        prescriptions,
        fetchPrescriptions,
        token,
        getPrescriptionDetails,
        prescriptionDetails,
        setPrescriptionDetails,
        searchResults,
        searchLoading,
        searchError,
        searchMedicine,

        prescriptionsCart,
        fetchPrescriptionsCart,

        isCartUpdated,
      }}
    >
      {children}
    </PrescriptionContext.Provider>
  );
};

export const usePrescriptionContext = () => useContext(PrescriptionContext);

export default PrescriptionProvider;
