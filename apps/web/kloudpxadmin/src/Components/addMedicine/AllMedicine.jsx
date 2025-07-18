import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useNavigate } from "react-router-dom";
import { useGetDataContext } from "../../contexts/GetDataContext";
import { getMedicineColumns } from "./MedicineTable";

const AllMedicine = () => {
  const { medicines, fetchMedicines, deleteMedicine, uploadExcel } =
    useGetDataContext();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    uploadExcel(file);
  };

  const handleEdit = (medicine) => {
    navigate("/edit-medicine", { state: { medicine } });
  };

  const columns = getMedicineColumns({ handleEdit, deleteMedicine });

console.log(medicines)

  return (
    <div className="md:p-4 mt-16 mx-[4vw]">
      <div className="flex flex-col md:flex-row justify-between items-center md:gap-4 gap-8 md:mb-6 mb-12">
        <h1 className="text-3xl text-[#0070ba] font-bold text-center md:text-left">
          🧾 All Items
        </h1>
        <div>
          <label className="cursor-pointer bg-[#0070ba] text-white px-12 py-3 rounded hover:bg-blue-700 transition">
            Upload Excel
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleExcelUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

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
          // scroll={{ x: 3000 }}
           scroll={{ x: 'max-content' }}
          bordered
        />
      </div>
    </div>
  );
};

export default AllMedicine;
