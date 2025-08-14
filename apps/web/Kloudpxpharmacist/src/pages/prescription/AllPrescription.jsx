import React, { useEffect, useState } from "react";
import { usePrescriptionContext } from "../../contexts/PrescriptionContext";
import { Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { allPrescriptions, fetchAllPrescriptions } = usePrescriptionContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (!allPrescriptions || allPrescriptions?.length === 0) {
      fetchAllPrescriptions();
    }
  }, []);

  console.log(allPrescriptions);

  const columns = [
    {
      title: "Sr. No.",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "User ID",
      dataIndex: "userid",
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <strong className="text-[#0070ba]">{text}</strong>,
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Pending",
      dataIndex: "pendingprescription",
      render: (pending) => (
        <Tag color="orange" className="font-medium px-2">
          {pending}
        </Tag>
      ),
    },
    {
      title: "Past",
      dataIndex: "pastprescription",
      render: (past) => (
        <Tag color="blue" className="font-medium px-2">
          {past}
        </Tag>
      ),
    },
  ];

  return (
    <div className="px-2 md:px-6 py-4 md:mt-20 mt-12">
      <div className="text-[#0070ba]">
        <h1 className="text-xl sm:text-3xl text-center font-bold">
          🧾 All Prescriptions
        </h1>
      </div>

      <div className="bg-white mt-6 md:mx-[4vw] md:p-2 cursor-pointer rounded rounded-b-md shadow-md overflow-auto">
        <Table
          dataSource={allPrescriptions || []}
          columns={columns}
          rowKey="userid"
          pagination={{
            current: currentPage,
            pageSize,
            onChange: setCurrentPage,
            showSizeChanger: false,
          }}
          bordered
          className="w-full"
          onRow={(record) => ({
            onClick: () => navigate(`/prescription-details/${record.userid}`),
          })}
        />
      </div>
    </div>
  );
};

export default Home;
