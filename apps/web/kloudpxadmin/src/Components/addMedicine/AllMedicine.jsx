import React, { useEffect, useState } from "react";
import { Button, message, Modal, Spin, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import Title from "../comman/Title";
import { useAuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import endpoints from "../../config/endpoints";
import MedicineTable from "./MedicineTable";

const AllMedicine = () => {
  const { getAllMedicines, medicines, medicineError, token, loading } =
    useAuthContext();
  const [formattedMedicines, setFormattedMedicines] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAllMedicines();
  }, []);

  useEffect(() => {
    if (medicines && medicines.length > 0) {
      const formatted = medicines.map((item) => ({
        _id: item.ID,
        brandName: item.BrandName,
        power: item.Power,
        discount: item.Discount,
        genericName: {
          value: item.Generic.ID,
          label: item.Generic.GenericName,
        },
        description: item.Description,
        category: {
          value: item.Category?.ID,
          label: item.Category?.CategoryName,
        },
        categoryIcon: item.Category?.CategoryIcon?.Icon || null,
        unitType: {
          value: item.UnitOfMeasurement,
          label: item.UnitOfMeasurement,
        },
        measurementValue: item.MeasurementUnitValue,
        piecesPerBox: item.NumberOfPiecesPerBox,
        spPerBox: item.SellingPricePerBox,
        spPerPiece: item.SellingPricePerPiece,
        cpPerBox: item.CostPricePerBox,
        cpPerPiece: item.CostPricePerPiece,
        supplier: {
          value: item.Supplier.ID,
          label: item.Supplier.SupplierName,
        },
        supplierDiscount: item.SupplierDiscount
          ? item.SupplierDiscount.replace("%", "")
          : "0",
        minThreshold: item.MinimumThreshold,
        maxThreshold: item.MaximumThreshold,
        leadTime: item.EstimatedLeadTimeDays,
        taxType: { value: item.TaxType, label: item.TaxType },
        images: item.ItemImages?.map((img) => img.FileName) || [],
        prescription: item.Prescription,
        isBrand: item.IsBrand,
      }));
      setFormattedMedicines(formatted);
    } else {
      setFormattedMedicines([]);
    }
  }, [medicines]);

  const showDeleteModal = (id) => {
    setDeleteId(id);
    setModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(endpoints.medicine.delete(deleteId), {
        headers: { Authorization: `${token}` },
      });
      setFormattedMedicines((prev) =>
        prev.filter((item) => item._id !== deleteId)
      );
      message.success("Medicine deleted successfully");
      await getAllMedicines();
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete medicine");
    } finally {
      setModalVisible(false);
      setDeleteId(null);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setDeleteId(null);
  };

  return (
    <div className="mt-20 mx-0 md:mx-8 lg:mx-20">
      <div
        className="bg-white shadow-lg rounded-lg sm:p-6 p-2 overflow-auto"
        style={{ maxHeight: "600px" }}
      >
        <div className="mb-6">
          <Title text="All Items" />
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <Spin size="large" />
          </div>
        ) : medicineError ? (
          <p className="text-center text-red-600 font-semibold mt-16">
            {medicineError}
          </p>
        ) : formattedMedicines.length === 0 ? (
          <Empty description="No medicines found" className="py-32" />
        ) : (
          <MedicineTable
            data={formattedMedicines}
            onEdit={navigate}
            onDelete={showDeleteModal}
          />
        )}
      </div>

      <Modal
        title={
          <span className="text-red-600 font-bold text-lg">
            Confirm Deletion
          </span>
        }
        open={modalVisible}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Delete"
        okButtonProps={{
          danger: true,
          className: "bg-red-600 hover:bg-red-700",
        }}
        cancelButtonProps={{ className: "hover:bg-gray-200" }}
        centered
        bodyStyle={{ fontSize: "1rem" }}
      >
        <p>Are you sure you want to delete this medicine?</p>
      </Modal>
    </div>
  );
};

export default AllMedicine;
