import React, { useEffect, useState, useMemo } from "react";
import { Table, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useGetDataContext } from "../../contexts/GetDataContext";
import { getMedicineColumns } from "./MedicineTable";

import debounce from "lodash.debounce";
import { getAxiosCall } from "../../Axios/UniversalAxiosCalls";
import endpoints from "../../config/endpoints";

const AllMedicine = () => {
  const { medicines, fetchMedicines, deleteMedicine, uploadExcel } =
    useGetDataContext();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  // 🧠 Debounced search handler
  const handleSearch = async (value) => {
    const trimmed = value.trim();
    setSearchTerm(value);

    if (trimmed === "") {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const res = await getAxiosCall(
        // `http://localhost:10001/v1/medicine/search-medicine`,
        endpoints.medicine.search,
        { q: trimmed }
      );

      console.log(res?.data);

      const filtered = res?.data?.medicines?.filter((item) => {
        const searchLower = trimmed.toLowerCase();
        return (
          item?.GenericName?.toLowerCase().includes(searchLower) ||
          item?.CategoryName?.toLowerCase().includes(searchLower) ||
          item?.BrandName?.toLowerCase().includes(searchLower)
        );
      });

      const normalized = filtered.map((item) => ({
        ...item,
        Category: { CategoryName: item.CategoryName || "N/A" },
        Generic: { GenericName: item.GenericName || "N/A" },
        Supplier: { SupplierName: item.SupplierName || "N/A" },
      }));

      setSearchResults(normalized);
    } catch (error) {
      setSearchResults([]);
    }
  };

  // ⏳ Debounce setup (300ms)
  const handleSearchDebounced = useMemo(() => debounce(handleSearch, 300), []);

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    uploadExcel(file);
  };

  const handleEdit = (medicine) => {
    navigate("/edit-medicine", { state: { medicine } });
  };

  const columns = getMedicineColumns({ handleEdit, deleteMedicine });
  const dataToShow = isSearching ? searchResults : medicines;

  return (
    <div className="md:p-4 mt-16 mx-[4vw]">
      <div className="flex flex-col md:flex-row justify-between items-center md:gap-4 gap-8 md:mb-6 mb-12">
        <h1 className="text-3xl text-[#0070ba] font-bold text-center md:text-left">
          🧾 All Items
        </h1>

        <div className="flex md:flex-row flex-col gap-4 items-center">
          {/* 🔍 Search */}
          <Input
            placeholder="Search Generic / Category / Brand"
            allowClear
            onChange={(e) => {
              const val = e.target.value;
              setSearchTerm(val);
              handleSearchDebounced(val);
            }}
            style={{ width: 300 }}
            value={searchTerm}
            className="border-2 border-blue-500 p-3 rounded-md placeholder:text-gray-600"
          />

          {/* 📤 Upload Excel */}
          <label className="cursor-pointer bg-[#0070ba] text-white px-8 py-3 rounded hover:bg-blue-700 transition">
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
          dataSource={dataToShow}
          rowKey={(record) => record.ID}
          pagination={{
            current: currentPage,
            pageSize,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
          }}
          scroll={{ x: "max-content" }}
          bordered
        />
      </div>
    </div>
  );
};

export default AllMedicine;
