import React, { useEffect, useState } from "react";
import { Table, Image, Tooltip, Button } from "antd";
import { FaEdit, FaTrash } from "react-icons/fa";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useGetDataContext } from "../../contexts/GetDataContext";

const AllMedicine = () => {
  const { medicines, fetchMedicines, deleteMedicine } = useGetDataContext();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleEdit = (medicine) => {
    navigate("/edit-medicine", { state: { medicine } });
  };

  const renderTick = (val) =>
    val ? (
      <CheckCircleTwoTone twoToneColor="#52c41a" />
    ) : (
      <CloseCircleTwoTone twoToneColor="#ff4d4f" />
    );

  const columns = [
    {
      title: "Brand",
      dataIndex: "BrandName",
      key: "BrandName",
      fixed: "left",
      align: "center",
    },
    {
      title: "Category",
      dataIndex: ["Category", "CategoryName"],
      key: "CategoryName",
      align: "center",
    },
    {
      title: "Subclass",
      dataIndex: "CategorySubClass",
      key: "CategorySubClass",
      align: "center",
    },
    {
      title: "Generic",
      dataIndex: ["Generic", "GenericName"],
      key: "GenericName",
      align: "center",
    },
    {
      title: "Supplier",
      dataIndex: ["Supplier", "SupplierName"],
      key: "SupplierName",
      align: "center",
    },
    {
      title: "Power",
      dataIndex: "Power",
      key: "Power",
      align: "center",
    },
    {
      title: "Dosage",
      dataIndex: "DosageForm",
      key: "DosageForm",
      align: "center",
    },
    {
      title: "Packaging",
      dataIndex: "Packaging",
      key: "Packaging",
      align: "center",
    },
    {
      title: "SP/Box",
      dataIndex: "SellingPricePerBox",
      key: "SellingPricePerBox",
      align: "center",
      render: (price) => `₹${price?.toFixed(2)}`,
    },
    {
      title: "SP/Piece",
      dataIndex: "SellingPricePerPiece",
      key: "SellingPricePerPiece",
      align: "center",
      render: (price) => `₹${price?.toFixed(2)}`,
    },
    {
      title: "CP/Box",
      dataIndex: "CostPricePerBox",
      key: "CostPricePerBox",
      align: "center",
      render: (price) => `₹${price?.toFixed(2)}`,
    },
    {
      title: "CP/Piece",
      dataIndex: "CostPricePerPiece",
      key: "CostPricePerPiece",
      align: "center",
      render: (price) => `₹${price?.toFixed(2)}`,
    },
    {
      title: "Tax",
      dataIndex: "TaxType",
      key: "TaxType",
      align: "center",
    },
    {
      title: "Discount",
      dataIndex: "Discount",
      key: "Discount",
      align: "center",
    },
    {
      title: "Supplier Discount",
      dataIndex: "SupplierDiscount",
      key: "SupplierDiscount",
      align: "center",
    },
    {
      title: "Unit Value",
      dataIndex: "MeasurementUnitValue",
      key: "MeasurementUnitValue",
      align: "center",
    },
    {
      title: "Unit",
      dataIndex: "UnitOfMeasurement",
      key: "UnitOfMeasurement",
      align: "center",
    },
    {
      title: "Pieces/Box",
      dataIndex: "NumberOfPiecesPerBox",
      key: "NumberOfPiecesPerBox",
      align: "center",
    },
    {
      title: "Max Thresh.",
      dataIndex: "MaximumThreshold",
      key: "MaximumThreshold",
      align: "center",
    },
    {
      title: "Min Thresh.",
      dataIndex: "MinimumThreshold",
      key: "MinimumThreshold",
      align: "center",
    },
    {
      title: "Lead Time (Days)",
      dataIndex: "EstimatedLeadTimeDays",
      key: "EstimatedLeadTimeDays",
      align: "center",
    },
    {
      title: "Marketer",
      dataIndex: "Marketer",
      key: "Marketer",
      align: "center",
    },
    {
      title: "Inhouse",
      dataIndex: "InhouseBrand",
      key: "InhouseBrand",
      align: "center",
      render: renderTick,
    },
    {
      title: "Is Brand",
      dataIndex: "IsBrand",
      key: "IsBrand",
      align: "center",
      render: renderTick,
    },
    {
      title: "Prescription",
      dataIndex: "Prescription",
      key: "Prescription",
      align: "center",
      render: renderTick,
    },
    {
      title: "Images",
      dataIndex: "ItemImages",
      key: "ItemImages",
      align: "center",
      render: (images) =>
        images?.length ? (
          <div className="flex flex-wrap justify-center gap-1">
            {images.map((img, i) => (
              <Image
                key={i}
                src={img.FileName}
                alt="med"
                width={40}
                height={40}
                style={{ objectFit: "cover" }}
              />
            ))}
          </div>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center gap-3">
          <Tooltip title="Edit">
            <Button
              type="link"
              icon={<FaEdit className="text-blue-600" />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="link"
              icon={<FaTrash className="text-red-600" />}
              onClick={() => deleteMedicine(record.ID)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 mt-16 mx-[4vw]">
      <h1 className="text-3xl text-blue-700 font-bold text-center mb-6">
        🧾 All Medicines
      </h1>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={medicines}
          rowKey={(record) => record.ID}
          pagination={{
            current: currentPage,
            pageSize,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
          }}
          scroll={{ x: 3000 }}
          bordered
        />
      </div>
    </div>
  );
};

export default AllMedicine;
