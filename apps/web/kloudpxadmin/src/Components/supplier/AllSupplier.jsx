import React, { useState } from "react";
import { Table, Button, Modal, message } from "antd";
import { RiEditLine, RiDeleteBin6Line } from "react-icons/ri";
import Title from "../comman/Title";

const initialSuppliers = [
    {
        _id: "1",
        supplierName: "Health Supplier",
        supplierProduct: "Painkillers",
        discount: 10,
    },
    {
        _id: "2",
        supplierName: "Pharma Ltd",
        supplierProduct: "Antibiotics",
        discount: 15,
    },
];

const SupplierList = () => {
    const [suppliers, setSuppliers] = useState(initialSuppliers);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const showDeleteModal = (id) => {
        setDeleteId(id);
        setModalVisible(true);
    };

    const handleDelete = () => {
        setSuppliers((prev) => prev.filter((item) => item._id !== deleteId));
        message.success("Supplier deleted successfully");
        setModalVisible(false);
        setDeleteId(null);
    };

    const handleCancel = () => {
        setModalVisible(false);
        setDeleteId(null);
    };

    const columns = [
        {
            title: "Supplier Name",
            dataIndex: "supplierName",
            key: "supplierName",
        },
        {
            title: "Product",
            dataIndex: "supplierProduct",
            key: "supplierProduct",
        },
        {
            title: "Discount (%)",
            dataIndex: "discount",
            key: "discount",
            render: (discount) => discount + "%",
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            width: 120,
            render: (_, record) => (
                <div className="flex justify-center gap-4 text-lg">
                    <Button
                        type="text"
                        icon={<RiEditLine className="text-blue-600 text-xl" />}
                        disabled
                        title="Edit (Coming soon)"
                    />
                    <Button
                        type="text"
                        danger
                        onClick={() => showDeleteModal(record._id)}
                        icon={<RiDeleteBin6Line className="text-red-600 text-xl" />}
                        title="Delete"
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="max-w-6xl mt-20 mx-auto p-4 bg-white rounded-lg shadow-md border border-[#0070BA]">
            <Title text="Supplier List" />

            <Table
                dataSource={suppliers}
                columns={columns}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
                scroll={{ x: true }}
                bordered
                className="mt-4"
            />

            <Modal
                title="Confirm Deletion"
                visible={modalVisible}
                onOk={handleDelete}
                onCancel={handleCancel}
                okText="Delete"
                okButtonProps={{ danger: true }}
                centered
            >
                <p>Are you sure you want to delete this supplier?</p>
            </Modal>
        </div>
    );
};

export default SupplierList;
