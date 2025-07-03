import React, { useEffect, useState } from "react";
import { Table, Button, message, Tooltip, Modal, Spin, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import Title from "../comman/Title";
import { RiEditLine, RiDeleteBin6Line } from "react-icons/ri";
import { useAuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import endpoints from "../../config/endpoints";

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

  console.log(medicines);

  useEffect(() => {
    if (medicines && medicines.length > 0) {
      const formatted = medicines.map((item) => ({
        _id: item.ID,
        brandName: item.BrandName,
        genericName: {
          value: item.Generic.ID,
          label: item.Generic.GenericName,
        },
        description: item.Description,
        category: {
          value: item.Category?.ID,
          label: item.Category?.CategoryName,
        },
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

  const columns = [
    {
      title: "Brand Name",
      dataIndex: "brandName",
      key: "brandName",
      sorter: (a, b) => a.brandName.localeCompare(b.brandName),
    },

    {
      title: "Generic Name",
      dataIndex: ["genericName", "label"],
      key: "genericName",
      sorter: (a, b) => a.genericName.label.localeCompare(b.genericName.label),
    },

    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },

    { title: "Category", dataIndex: ["category", "label"], key: "category" },

    { title: "Unit", dataIndex: ["unitType", "label"], key: "unitType" },

    {
      title: "Measurement Value",
      dataIndex: "measurementValue",
      key: "measurementValue",
    },

    {
      title: "Pieces/Box",
      dataIndex: "piecesPerBox",
      key: "piecesPerBox",
      sorter: (a, b) => a.piecesPerBox - b.piecesPerBox,
    },

    {
      title: "SP/Box",
      dataIndex: "spPerBox",
      key: "spPerBox",
      sorter: (a, b) => a.spPerBox - b.spPerBox,
    },

    {
      title: "SP/Piece",
      dataIndex: "spPerPiece",
      key: "spPerPiece",
      sorter: (a, b) => a.spPerPiece - b.spPerPiece,
    },

    {
      title: "CP/Box",
      dataIndex: "cpPerBox",
      key: "cpPerBox",
      sorter: (a, b) => a.cpPerBox - b.cpPerBox,
    },

    {
      title: "CP/Piece",
      dataIndex: "cpPerPiece",
      key: "cpPerPiece",
      sorter: (a, b) => a.cpPerPiece - b.cpPerPiece,
    },

    { title: "Supplier", dataIndex: ["supplier", "label"], key: "supplier" },

    {
      title: "Supplier Discount (%)",
      dataIndex: "supplierDiscount",
      key: "supplierDiscount",
      sorter: (a, b) =>
        parseFloat(a.supplierDiscount) - parseFloat(b.supplierDiscount),
      render: (val) => `${val}%`,
    },

    { title: "Min Threshold", dataIndex: "minThreshold", key: "minThreshold" },

    { title: "Max Threshold", dataIndex: "maxThreshold", key: "maxThreshold" },

    {
      title: "Lead Time (days)",
      dataIndex: "leadTime",
      key: "leadTime",
      sorter: (a, b) => a.leadTime - b.leadTime,
    },

    { title: "Tax Type", dataIndex: ["taxType", "label"], key: "taxType" },

    {
      title: "Images",
      dataIndex: "images",
      key: "images",
      render: (images) =>
        images.length > 0 ? (
          <div className="flex gap-2 flex-wrap">
            {images.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`medicine-${idx}`}
                className="w-12 h-12 object-cover rounded border"
              />
            ))}
          </div>
        ) : (
          <span className="text-gray-400 text-xs">No Image</span>
        ),
    },

    {
      title: "Prescription",
      dataIndex: "prescription",
      key: "prescription",
      render: (val) => (val ? "✔️" : "❌"),
    },

    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 90,
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center gap-3">
          <Tooltip title="Edit">
            <Button
              type="primary"
              onClick={() => navigate(`/addMedicine/edit/${record._id}`)}
              icon={<RiEditLine className="text-white" />}
              size="small"
              className="bg-blue-600 hover:bg-blue-700 border-none"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="primary"
              danger
              onClick={() => showDeleteModal(record._id)}
              icon={<RiDeleteBin6Line className="text-white" />}
              size="small"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

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
          <Table
            dataSource={formattedMedicines}
            columns={columns}
            rowKey="_id"
            scroll={{ x: "max-content" }}
            bordered
            pagination={{ pageSize: 6 }}
            rowClassName={() =>
              "cursor-pointer hover:bg-blue-50 transition duration-200"
            }
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
