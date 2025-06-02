import { Button, message, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { deleteAxiosCall, getAxiosCall } from "../../Axios/UniversalAxiosCalls";
import PageWrapper from "../PageContainer/PageWrapper";
let columns = [];
function Home(props) {
  useEffect(() => {
    if (props?.userDetails?.role_id > 4) {
      columns = [
        {
          title: "User Id",
          dataIndex: "user_id",
          key: "user_id",
        },
        {
          title: "First Name",
          dataIndex: "first_name",
          key: "first_name",
        },
        {
          title: "Last Name",
          dataIndex: "last_name",
          key: "last_name",
        },
        {
          title: "Email Id",
          dataIndex: "email",
          key: "email",
        },
        {
          title: "Role Id",
          dataIndex: "role_id",
          key: "role_id",
        },

        {
          title: "Action",
          dataIndex: "",
          key: "x",
          render: (text, record) => (
            <Button onClick={() => deleteRes(record)}>Delete</Button>
          ),
        },
      ];
    } else {
      columns = [
        {
          title: "User Id",
          dataIndex: "user_id",
          key: "user_id",
        },
        {
          title: "First Name",
          dataIndex: "first_name",
          key: "first_name",
        },
        {
          title: "Last Name",
          dataIndex: "last_name",
          key: "last_name",
        },
        {
          title: "Email Id",
          dataIndex: "email",
          key: "email",
        },
        {
          title: "Role Id",
          dataIndex: "role_id",
          key: "role_id",
        },
      ];
    }
  }, [props?.userDetails]);

  const [results, setResults] = useState("");
  const navigateTo = useNavigate();
  const fetchRes = async () => {
    const res = await getAxiosCall("/users");
    setResults(res.data?.users);
  };
  const deleteRes = async (record) => {
    if (props?.userDetails?.role_id === record?.role_id) {
      Swal.fire({
        title: "error",
        text: "You Cannot Delete Yourself",
        icon: "error",
        confirmButtonText: "Alright",
        allowOutsideClick: false,
      });
      return;
    }
    if (props?.userDetails?.role_id > 4) {
      deleteUser(Number(record?.user_id));
    }
  };
  const deleteUser = async (id) => {
    try {
      Swal.fire({
        title: "info",
        text: "Are You Sure You want to Delete This User",
        icon: "info",
        confirmButtonText: "Delete",
        showCancelButton: true,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteAxiosCall("/deleteUser", id);
          message.success("User deleted successfully");
          window.location.reload();
        }
      });
    } catch (error) {
      console.error("Error deleting User:", error);
      message.error("Failed to delete User");
    }
  };
  return (
    <div className="flex flex-col">
      <div className="flex justify-center my-8">
        <h1 className="text-2xl font-medium">
          Hi, {props.userDetails?.firstName}
          {"  "}
          {props.userDetails?.lastName}
        </h1>
      </div>
      <div className="flex justify-center items-center">
        <Button type="primary" onClick={fetchRes} className="text-black">
          Click to Check Users
        </Button>
      </div>
      <PageWrapper>
        <Table
          columns={columns}
          dataSource={results}
          size="large"
          style={{
            width: "100rem",
          }}

          // scroll={{
          //   x: 1500,
          //   y: 1000,
          // }}
        />
      </PageWrapper>
    </div>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    loggedOut: () => dispatch({ type: "LOGGEDOUT" }),
  };
};
const mapStateToProps = (state) => {
  return {
    userDetails: state.universalReducer,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
