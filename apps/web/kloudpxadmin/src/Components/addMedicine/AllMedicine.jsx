import React, { useEffect, useState } from "react";
import { Table, Button, message, Tooltip, Modal, Spin, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import Title from "../comman/Title";
import { RiEditLine, RiDeleteBin6Line } from "react-icons/ri";
import { useAuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import endpoints from "../../config/endpoints";

// Icon sets
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as TbIcons from "react-icons/tb";
import * as MdIcons from "react-icons/md";
import * as BiIcons from "react-icons/bi";
import * as GiIcons from "react-icons/gi";

// Combine all icons
const allIcons = {
  ...FaIcons,
  ...AiIcons,
  ...TbIcons,
  ...MdIcons,
  ...BiIcons,
  ...GiIcons,
};

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
        power: item.Power,
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
      title: "Power",
      dataIndex: "power",
      key: "power",
    },
    {
      title: "Category Icon",
      dataIndex: "categoryIcon",
      key: "categoryIcon",
      render: (iconName) => {
        if (!iconName)
          return <span className="text-gray-400 italic">No Data</span>;
        const IconComponent = allIcons[iconName];
        return IconComponent ? (
          <IconComponent className="text-xl" />
        ) : (
          <span className="text-gray-500 italic">{iconName}</span>
        );
      },
    },

    {
      title: "Generic Name",
      dataIndex: ["genericName", "label"],
      key: "genericName",
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
    },
    {
      title: "SP/Box",
      dataIndex: "spPerBox",
      key: "spPerBox",
    },
    {
      title: "SP/Piece",
      dataIndex: "spPerPiece",
      key: "spPerPiece",
    },
    {
      title: "CP/Box",
      dataIndex: "cpPerBox",
      key: "cpPerBox",
    },
    {
      title: "CP/Piece",
      dataIndex: "cpPerPiece",
      key: "cpPerPiece",
    },
    { title: "Supplier", dataIndex: ["supplier", "label"], key: "supplier" },
    {
      title: "Supplier Discount (%)",
      dataIndex: "supplierDiscount",
      key: "supplierDiscount",
      render: (val) => `${val}%`,
    },
    { title: "Min Threshold", dataIndex: "minThreshold", key: "minThreshold" },
    { title: "Max Threshold", dataIndex: "maxThreshold", key: "maxThreshold" },
    {
      title: "Lead Time (days)",
      dataIndex: "leadTime",
      key: "leadTime",
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
              // onClick={() => navigate(`/addMedicine/edit/${record._id}`)}
              onClick={() => {
                console.log("User clicked Edit — Medicine data:", record);
                navigate(`/addMedicine/edit/${record._id}`);
              }}
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
