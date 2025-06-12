
import React, { useState } from "react";
import { Table, Button, message, Tooltip, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import Title from "../comman/Title";
import { RiEditLine, RiDeleteBin6Line } from "react-icons/ri";

const demoMedicines = [
    {
        _id: "1",
        brandName: "Paracetamol",
        genericName: { label: "Acetaminophen" },
        description: "Pain reliever and fever reducer",
        unitType: { label: "Tablet" },
        measurementValue: "500mg",
        piecesPerBox: 10,
        spPerBox: 100,
        spPerPiece: 10,
        cpPerBox: 80,
        cpPerPiece: 8,
        category: "Analgesic",
        supplier: { label: "Health Supplier" },
        taxType: { label: "GST 5%" },
        minThreshold: 10,
        maxThreshold: 100,
        leadTime: 7,
    },
    {
        _id: "2",
        brandName: "Amoxicillin",
        genericName: { label: "Amoxicillin" },
        description: "Antibiotic",
        unitType: { label: "Capsule" },
        measurementValue: "250mg",
        piecesPerBox: 20,
        spPerBox: 200,
        spPerPiece: 10,
        cpPerBox: 150,
        cpPerPiece: 7.5,
        category: "Antibiotic",
        supplier: { label: "Pharma Ltd" },
        taxType: { label: "GST 12%" },
        minThreshold: 5,
        maxThreshold: 50,
        leadTime: 5,
    },
];

const AllMedicine = () => {
    const [medicines, setMedicines] = useState(demoMedicines);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();

    const showDeleteModal = (id) => {
        setDeleteId(id);
        setModalVisible(true);
    };

    const handleDelete = () => {
        setMedicines((prev) => prev.filter((item) => item._id !== deleteId));
        message.success("Medicine deleted");
        setModalVisible(false);
        setDeleteId(null);
    };

    const handleCancel = () => {
        setModalVisible(false);
        setDeleteId(null);
    };

    const columns = [
        { title: "Brand Name", dataIndex: "brandName", key: "brandName" },
        { title: "Generic Name", dataIndex: ["genericName", "label"], key: "genericName" },
        { title: "Description", dataIndex: "description", key: "description" },
        { title: "Unit Type", dataIndex: ["unitType", "label"], key: "unitType" },
        { title: "Measurement", dataIndex: "measurementValue", key: "measurementValue" },
        { title: "Pieces/Box", dataIndex: "piecesPerBox", key: "piecesPerBox" },
        { title: "SP/Box", dataIndex: "spPerBox", key: "spPerBox" },
        { title: "SP/Piece", dataIndex: "spPerPiece", key: "spPerPiece" },
        { title: "CP/Box", dataIndex: "cpPerBox", key: "cpPerBox" },
        { title: "CP/Piece", dataIndex: "cpPerPiece", key: "cpPerPiece" },
        { title: "Category", dataIndex: "category", key: "category" },
        { title: "Supplier", dataIndex: ["supplier", "label"], key: "supplier" },
        { title: "Tax", dataIndex: ["taxType", "label"], key: "taxType" },
        { title: "Min Threshold", dataIndex: "minThreshold", key: "minThreshold" },
        { title: "Max Threshold", dataIndex: "maxThreshold", key: "maxThreshold" },
        { title: "Lead Time (days)", dataIndex: "leadTime", key: "leadTime" },
        {
            title: "Actions",
            key: "actions",
            fixed: "right",
            width: 110,
            align: "center",
            render: (_, record) => (
                <div className="flex justify-center gap-4 ">
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            onClick={() => navigate(`/medicines/edit/${record._id}`)}
                            icon={<RiEditLine className="text-blue-600 text-xl" />}
                        />
                    </Tooltip>

                    <Tooltip title="Delete">
                        <Button
                            type="text"
                            danger
                            onClick={() => showDeleteModal(record._id)}
                            icon={<RiDeleteBin6Line className="text-red-600 text-xl" />}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <div className="mt-20 lg:mx-[5vw] md:mx-5 mx-2 ">

            <div className=" mt-4 bg-white border border-[#0070BA] shadow-md rounded-md p-4 overflow-auto"
                style={{ maxHeight: "500px" }}
            >
                <div className="pb-6">
                    <Title text="All Medicines" />
                </div>
                <Table
                    dataSource={medicines}
                    columns={columns}
                    rowKey="_id"
                    scroll={{ x: "max-content" }}
                    bordered
                    pagination={{ pageSize: 5 }}
                />
            </div>

            <Modal
                title="Confirm Deletion"
                visible={modalVisible}
                onOk={handleDelete}
                onCancel={handleCancel}
                okText="Delete"
                okButtonProps={{ danger: true }}
                centered
            >
                <p>Are you sure you want to delete this medicine?</p>
            </Modal>
        </div>
    );
};

export default AllMedicine;