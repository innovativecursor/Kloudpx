import React from "react";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { Image, Button, Tooltip } from "antd";
import { FaEdit, FaTrash } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { useIconComponent } from "../../hooks/useIconComponent";
import { RiDeleteBin4Fill } from "react-icons/ri";

const CategoryIconRenderer = ({ iconName }) => {
  const IconComponent = useIconComponent(iconName);
  return IconComponent ? <IconComponent size={20} /> : "N/A";
};

const renderTick = (val) =>
  val ? (
    <CheckCircleTwoTone twoToneColor="#52c41a" />
  ) : (
    <CloseCircleTwoTone twoToneColor="#ff4d4f" />
  );

export const getMedicineColumns = ({ handleEdit, deleteMedicine }) => [
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
    title: "Category Icon",
    key: "CategoryIcon",
    align: "center",
    render: (_, record) => {
      const iconName = record?.Category?.CategoryIcon?.Icon;
      return <CategoryIconRenderer iconName={iconName} />;
    },
  },
  {
    title: "Subclass",
    dataIndex: "CategorySubClass",
    key: "CategorySubClass",
    align: "center",
  },
  {
    title: "Description",
    dataIndex: "Description",
    key: "Description",
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
    title: "Is Featured",
    dataIndex: "IsFeature",
    key: "IsFeature",
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
            icon={<RiEdit2Fill className="text-[#0070ba] text-2xl" />}
            onClick={() => handleEdit(record)}
          />
        </Tooltip>
        <Tooltip title="Delete">
          <Button
            type="link"
            icon={<RiDeleteBin4Fill className="text-red-600 text-2xl" />}
            onClick={() => deleteMedicine(record.ID)}
          />
        </Tooltip>
      </div>
    ),
  },
];
