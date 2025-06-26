import React, { useEffect, useState } from "react";
import { Modal, Input, Button } from "antd";
import { usePrescriptionContext } from "../../contexts/PrescriptionContext";

const CustomModal = () => {
  const {
    selectedMedicineId,
    closeModal,
    isModalOpen,
    setIsModalOpen,
    modalInput,
    setModalInput,
    handleModalSubmit,
  } = usePrescriptionContext();

  useEffect(() => {
    if (selectedMedicineId) {
      setIsModalOpen(true);
    }
  }, [selectedMedicineId, setIsModalOpen]);

  const handleCancel = () => {
    setModalInput("");
    closeModal();
    setIsModalOpen(false);
  };

  return (
    <Modal
      title={`Add Quantity for Medicine ID: ${selectedMedicineId || ""}`}
      open={isModalOpen}
      onOk={handleModalSubmit}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          style={{ backgroundColor: "#0070ba", borderColor: "#0070ba" }}
          onClick={handleModalSubmit}
        >
          Submit
        </Button>,
      ]}
    >
      <label htmlFor="quantityInput" className="block mb-2 font-medium">
        Quantity
      </label>
      <Input
        id="quantityInput"
        placeholder="Enter quantity"
        value={modalInput}
        onChange={(e) => setModalInput(e.target.value)}
        type="number"
        min={1}
      />
    </Modal>
  );
};

export default CustomModal;
