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

  useEffect(() => {
    if (medicines && medicines.length > 0) {
      const formatted = medicines.map((item) => ({
        _id: item.ID,
        brandName: item.BrandName,
        genericName: { label: item.Generic.GenericName },
        description: item.Description,
        unitType: { label: item.UnitOfMeasurement },
        measurementValue: item.MeasurementUnitValue,
        piecesPerBox: item.NumberOfPiecesPerBox,
        spPerBox: item.SellingPricePerBox,
        spPerPiece: item.SellingPricePerPiece,
        cpPerBox: item.CostPricePerBox,
        cpPerPiece: item.CostPricePerPiece,
        category: item.Category,
        supplier: { label: item.Supplier.SupplierName },
        taxType: { label: item.TaxType },
        minThreshold: item.MinimumThreshold,
        maxThreshold: item.MaximumThreshold,
        leadTime: item.EstimatedLeadTimeDays,
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
    { title: "Unit Type", dataIndex: ["unitType", "label"], key: "unitType" },
    {
      title: "Measurement",
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
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Supplier", dataIndex: ["supplier", "label"], key: "supplier" },
    { title: "Tax", dataIndex: ["taxType", "label"], key: "taxType" },
    { title: "Min Threshold", dataIndex: "minThreshold", key: "minThreshold" },
    { title: "Max Threshold", dataIndex: "maxThreshold", key: "maxThreshold" },
    {
      title: "Lead Time (days)",
      dataIndex: "leadTime",
      key: "leadTime",
      sorter: (a, b) => a.leadTime - b.leadTime,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 110,
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center gap-4">
          <Tooltip title="Edit">
            <Button
              type="text"
              onClick={() => navigate(`/addMedicine/edit/${record._id}`)}
              icon={<RiEditLine className="text-blue-600 text-xl" />}
              size="middle"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              onClick={() => showDeleteModal(record._id)}
              icon={<RiDeleteBin6Line className="text-red-600 text-xl" />}
              size="middle"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-20 lg:mx-[5vw] md:mx-5 mx-2">
      <div
        className="mt-4 bg-white border border-[#0070BA] shadow-md rounded-md p-4 overflow-auto"
        style={{ maxHeight: "500px" }}
      >
        <div className="pb-6">
          <Title text="All Medicines" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : medicineError ? (
          <p className="text-red-500 text-center font-semibold">
            {medicineError}
          </p>
        ) : formattedMedicines.length === 0 ? (
          <Empty description="No medicines found" className="py-20" />
        ) : (
          <Table
            dataSource={formattedMedicines}
            columns={columns}
            rowKey="_id"
            scroll={{ x: "max-content" }}
            bordered
            pagination={{ pageSize: 5 }}
            rowClassName={() =>
              "hover:shadow-md transition-shadow duration-200 cursor-pointer"
            }
          />
        )}
      </div>

      <Modal
        title={
          <span className="text-red-600 font-semibold">Confirm Deletion</span>
        }
        open={modalVisible}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Delete"
        okButtonProps={{ danger: true }}
        centered
        bodyStyle={{ fontSize: "1rem" }}
      >
        <p>Are you sure you want to delete this medicine?</p>
      </Modal>
    </div>
  );
};

export default AllMedicine;
