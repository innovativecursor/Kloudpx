import React from "react";
import { Table, Button, Tooltip } from "antd";
import { RiEditLine, RiDeleteBin6Line } from "react-icons/ri";

import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as TbIcons from "react-icons/tb";
import * as MdIcons from "react-icons/md";
import * as BiIcons from "react-icons/bi";
import * as GiIcons from "react-icons/gi";

const allIcons = {
  ...FaIcons,
  ...AiIcons,
  ...TbIcons,
  ...MdIcons,
  ...BiIcons,
  ...GiIcons,
};

const MedicineTable = ({ data, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Brand Name",
      dataIndex: "brandName",
      key: "brandName",
      sorter: (a, b) => a.brandName.localeCompare(b.brandName),
    },
    { title: "Power", dataIndex: "power", key: "power" },
    { title: "Discount", dataIndex: "discount", key: "discount" },
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
          <span>{iconName}</span>
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
    { title: "Pieces/Box", dataIndex: "piecesPerBox", key: "piecesPerBox" },
    { title: "SP/Box", dataIndex: "spPerBox", key: "spPerBox" },
    { title: "SP/Piece", dataIndex: "spPerPiece", key: "spPerPiece" },
    { title: "CP/Box", dataIndex: "cpPerBox", key: "cpPerBox" },
    { title: "CP/Piece", dataIndex: "cpPerPiece", key: "cpPerPiece" },
    { title: "Supplier", dataIndex: ["supplier", "label"], key: "supplier" },
    {
      title: "Supplier Discount (%)",
      dataIndex: "supplierDiscount",
      key: "supplierDiscount",
      render: (val) => `${val}%`,
    },
    { title: "Min Threshold", dataIndex: "minThreshold", key: "minThreshold" },
    { title: "Max Threshold", dataIndex: "maxThreshold", key: "maxThreshold" },
    { title: "Lead Time (days)", dataIndex: "leadTime", key: "leadTime" },
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
                alt={`img-${idx}`}
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
      title: "IsBrand",
      dataIndex: "isBrand",
      key: "isBrand",
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
              onClick={() => onEdit(`/addMedicine/edit/${record._id}`)}
              icon={<RiEditLine className="text-white" />}
              size="small"
              className="bg-blue-600 hover:bg-blue-700 border-none"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="primary"
              danger
              onClick={() => onDelete(record._id)}
              icon={<RiDeleteBin6Line className="text-white" />}
              size="small"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="_id"
      scroll={{ x: "max-content" }}
      bordered
      pagination={{ pageSize: 6 }}
      rowClassName={() =>
        "cursor-pointer hover:bg-blue-50 transition duration-200"
      }
    />
  );
};

export default MedicineTable;
