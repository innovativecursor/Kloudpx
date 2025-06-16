import React, { useEffect, useState } from "react";
import GlobalForm from "../GlobalForm/GlobalForm";
import { Button, Input, Menu, Modal, Table, message } from "antd";
import PageWrapper from "../PageContainer/PageWrapper";
import { deleteAxiosCall, getAxiosCall } from "../../Axios/UniversalAxiosCalls";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { SearchOutlined } from "@ant-design/icons";

function ProductTable(props) {
  const [openModal, setopenModal] = useState(false);
  const [inqMessage, setInqMessage] = useState("");
  const [result, setResult] = useState(null);
  const navigateTo = useNavigate();

  const inquiry_columns = [
    {
      title: "Inquiry_ID",
      dataIndex: "inquiry_id",
      key: "inquiry_id",
      fixed: "left",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobile_number",
      key: "mobile_number",
    },
    {
      title: "Action",
      key: "view",
      render: (text, record) => (
        <Button
          onClick={() => {
            setopenModal(true);
            setInqMessage(record?.message);
          }}
        >
          View
        </Button>
      ),
    },
    {
      title: "Action",
      key: "delete",
      render: (text, record) => (
        <Button onClick={() => deleteInquiry(record.inquiry_id)}>Delete</Button>
      ),
    },
  ];

  const testimonials_col = [
    {
      title: "Client's Name",
      dataIndex: "reviewer_name",
      key: "reviewer_name",
      fixed: "left",
    },
    {
      title: "Client Location",
      dataIndex: "reviewer_location",
      key: "reviewer_location",
    },
    {
      title: "Client Rating",
      dataIndex: "client_rating",
      key: "client_rating",
    },
  ];

  const staff_col = [
    {
      title: "Staff Name",
      dataIndex: "staff_name",
      key: "staff_name",
      fixed: "left",
    },
    {
      title: "Staff Designation",
      dataIndex: "staff_position",
      key: "staff_position",
    },
  ];

  const services_col = [
    {
      title: "Service Name",
      dataIndex: "service_name",
      key: "service_name",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
  ];

  const projects_col = [
    {
      title: "Project Id",
      dataIndex: "project_id",
      key: "project_id",
      fixed: "left",
    },
    {
      title: "Name of the Project",
      dataIndex: "project_name",
      key: "project_name",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Project Name"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, backgroundColor: "blue" }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters()}
            size="small"
            style={{ width: 90, marginTop: 4 }}
          >
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) =>
        record.project_name
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },
  ];

  const medicines_col = [
    {
      title: "Medicine Name",
      dataIndex: "medicine_name",
      key: "medicine_name",
      fixed: "left",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ];

  const otc_products_col = [
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
      fixed: "left",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ];

  const deleteInquiry = async (id) => {
    try {
      Swal.fire({
        title: "info",
        text: "Are You Sure You want to Delete This Inquiry",
        icon: "info",
        confirmButtonText: "Delete",
        showCancelButton: true,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteAxiosCall("/deleteInquiry", id);
          navigateTo("/inquiries");
          message.success("Inquiry deleted successfully");
        }
      });
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      message.error("Failed to delete inquiry");
    }
  };

  useEffect(() => {
    answer();
  }, [props?.type]);

  const answer = async () => {
    if (props?.type === "Inquiries") {
      const result = await getAxiosCall("/fetchInquiries");
      setResult(result?.data);
    } else if (props?.type === "Projects") {
      const result = await getAxiosCall("/getproject");
      setResult(result?.data);
    } else if (props?.type === "Services") {
      const result = await getAxiosCall("/getservice");
      setResult(result?.data);
    } else if (props?.type === "Testimonials") {
      const result = await getAxiosCall("/gettestimonials");
      setResult(result?.data);
    } else if (props?.type === "Staff") {
      const result = await getAxiosCall("/getteam");
      setResult(result?.data);
    } else if (props?.type === "Medicines") {
      const result = await getAxiosCall("/getMedicines");
      setResult(result?.data);
    } else if (props?.type === "OTC_Products") {
      const result = await getAxiosCall("/getOTCProducts");
      setResult(result?.data);
    }
  };

  const renderTable = () => {
    switch (props.type) {
      case "Projects":
        return (
          <PageWrapper title={`${props.pageMode} Projects`}>
            <Table
              columns={projects_col}
              dataSource={result}
              size="large"
              onRow={(record) => ({
                onClick: () => {
                  navigateTo(
                    props.pageMode === "Delete"
                      ? "/deleteProjectsinner"
                      : "/updateProjectsinner",
                    { state: record }
                  );
                },
              })}
              scroll={{ x: 1000, y: 1500 }}
            />
          </PageWrapper>
        );
      case "Inquiries":
        return (
          <>
            <PageWrapper title={`${props.type}`}>
              <Table
                columns={inquiry_columns}
                dataSource={result}
                size="large"
                scroll={{ x: 1000, y: 1500 }}
              />
            </PageWrapper>
            <Modal
              open={openModal}
              title="Description"
              centered
              maskClosable={true}
              closable={true}
              footer={null}
              destroyOnClose={true}
              onCancel={() => setopenModal(false)}
            >
              <p>{inqMessage}</p>
            </Modal>
          </>
        );
      case "Services":
        return (
          <PageWrapper title={`${props.pageMode} Services`}>
            <Table
              columns={services_col}
              dataSource={result}
              size="large"
              onRow={(record) => ({
                onClick: () => {
                  navigateTo(
                    props.pageMode === "Delete"
                      ? "/deleteServicesinner"
                      : "/updateServicesinner",
                    { state: record }
                  );
                },
              })}
              scroll={{ x: 1000, y: 1500 }}
            />
          </PageWrapper>
        );
      case "Testimonials":
        return (
          <PageWrapper title={`${props.pageMode} Testimonials`}>
            <Table
              columns={testimonials_col}
              dataSource={result}
              size="large"
              onRow={(record) => ({
                onClick: () => {
                  navigateTo(
                    props.pageMode === "Delete"
                      ? "/deleteTestimonialinner"
                      : "/updateTestimonialinner",
                    { state: record }
                  );
                },
              })}
              scroll={{ x: 1000, y: 1500 }}
            />
          </PageWrapper>
        );
      case "Staff":
        return (
          <PageWrapper title={`${props.pageMode} Staff`}>
            <Table
              columns={staff_col}
              dataSource={result}
              size="large"
              onRow={(record) => ({
                onClick: () => {
                  navigateTo(
                    props.pageMode === "Delete"
                      ? "/deleteStaffinner"
                      : "/updateStaffinner",
                    { state: record }
                  );
                },
              })}
              scroll={{ x: 1000, y: 1500 }}
            />
          </PageWrapper>
        );
      case "Medicines":
        return (
          <PageWrapper title={`${props.pageMode} Medicines`}>
            <Table
              columns={medicines_col}
              dataSource={result}
              size="large"
              onRow={(record) => ({
                onClick: () => {
                  navigateTo(
                    props.pageMode === "Delete"
                      ? "/deleteMedicine"
                      : "/updateMedicine",
                    { state: record }
                  );
                },
              })}
              scroll={{ x: 1000, y: 1500 }}
            />
          </PageWrapper>
        );
      case "OTC_Products":
        return (
          <PageWrapper title={`${props.pageMode} OTC Products`}>
            <Table
              columns={otc_products_col}
              dataSource={result}
              size="large"
              onRow={(record) => ({
                onClick: () => {
                  navigateTo(
                    props.pageMode === "Delete" ? "/deleteOTC" : "/updateOTC",
                    { state: record }
                  );
                },
              })}
              scroll={{ x: 1000, y: 1500 }}
            />
          </PageWrapper>
        );
      default:
        return <p>No data available</p>;
    }
  };

  return (
    <>
      <GlobalForm />
      {renderTable()}
    </>
  );
}

export default ProductTable;















