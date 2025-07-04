import { createContext, useContext, useState, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { usePrescriptionContext } from "./PrescriptionContext";
import { useNavigate } from "react-router-dom";

export const CartpresciContext = createContext();

const CartpresciProvider = ({ children }) => {
  const navigate = useNavigate();

  const {
    fetchPrescriptionsCart,
    prescriptionDetails,
    fetchPrescriptions,
    setIsCartUpdated,
    token,
  } = usePrescriptionContext();

  const [selectedMedicineId, setSelectedMedicineId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInput, setModalInput] = useState("");

  const initialLengthRef = useRef(0);
  const userId = prescriptionDetails?.data?.User?.ID;

  const openModal = (id) => {
    setSelectedMedicineId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMedicineId(null);
    setModalInput("");
    setIsModalOpen(false);
  };

  const handleModalSubmit = async () => {
    if (!modalInput.trim()) {
      return Swal.fire("Warning", "Quantity is required", "warning");
    }

    if (!selectedMedicineId || !userId) {
      return Swal.fire(
        "Error",
        "Missing medicine or user information",
        "error"
      );
    }

    try {
      await axios.post(
        `http://localhost:10002/v1/pharmacist/add-medicine-to-prescriptions/${userId}`,
        {
          medicineId: selectedMedicineId,
          quantity: Number(modalInput),
        },
        {
          headers: { Authorization: token },
        }
      );

      Swal.fire(
        "Success",
        "Medicine added successfully to prescription",
        "success"
      );
      fetchPrescriptionsCart?.();
      closeModal();
    } catch (error) {
      const errorMessage = error?.response?.data?.error;
      const available = error?.response?.data?.available;

      if (errorMessage === "Insufficient stock") {
        return Swal.fire(
          "Insufficient Stock",
          `Only ${available} items are available.`,
          "error"
        );
      }

      Swal.fire("Error", "Failed to add medicine", "error");
    }
  };

  const submitPrescriptions = async () => {
    if (!userId) {
      return Swal.fire("Error", "User ID is missing", "error");
    }

    try {
      const response = await axios.post(
        `http://localhost:10002/v1/pharmacist/submit-prescriptions/${userId}`,
        {},
        {
          headers: { Authorization: token },
        }
      );

      if (response.status === 200) {
        Swal.fire("Success", "Prescriptions submitted successfully", "success");
        navigate("/findprescription");
        fetchPrescriptions?.();
        setIsCartUpdated?.(false);
        initialLengthRef.current = 0;
      } else {
        Swal.fire("Error", "Failed to submit prescriptions", "error");
      }
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire("Error", "Something went wrong during submission", "error");
    }
  };

  return (
    <CartpresciContext.Provider
      value={{
        selectedMedicineId,
        setSelectedMedicineId,
        isModalOpen,
        setIsModalOpen,
        modalInput,
        setModalInput,
        handleModalSubmit,
        closeModal,
        openModal,
        submitPrescriptions,
      }}
    >
      {children}
    </CartpresciContext.Provider>
  );
};

export default CartpresciProvider;
export const useCartpresciContext = () => useContext(CartpresciContext);
