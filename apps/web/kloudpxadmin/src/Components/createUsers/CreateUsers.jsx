import React, { useState } from "react";
import PageWrapper from "../PageContainer/PageWrapper";
import { Button, Form, Input } from "antd";
import Swal from "sweetalert2";
import { postAxiosCall } from "../../Axios/UniversalAxiosCalls";

function CreateUsers() {
  const [inputs, setInputs] = useState({});
  const submit = async () => {
    let cloneInputs = { ...inputs };
    cloneInputs = { ...cloneInputs, code: 8050, role_id: 4 };
    console.log("cloneInputs", cloneInputs);
    setInputs({ ...cloneInputs });
    if (inputs?.password !== inputs?.confirm_password) {
      Swal.fire({
        title: "error",
        text: "Passwords don't match",
        icon: "error",
        confirmButtonText: "Alright!",
        allowOutsideClick: false,
      });
      return;
    } else {
      const result = await postAxiosCall("/signup", cloneInputs);

      if (result) {
        Swal.fire({
          title: "Success",
          text: result?.message,
          icon: "success",
          confirmButtonText: "Great!",
          allowOutsideClick: false,
        }).then(() => {
          window.location.reload(true);
        });
        setInputs({});
      }
    }
  };
  return (
    <PageWrapper title="Add Users">
      <Form onFinish={submit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className="First Name">
            <div className="label">
              First Name <span className="text-red-500">*</span>
            </div>
            <Input
              name="first_name"
              required
              size="large"
              onChange={(e) =>
                setInputs({ ...inputs, [e.target.name]: e.target.value })
              }
              value={inputs?.first_name}
            />
          </div>
          <div className="Last Name">
            <div className="label">
              Last Name <span className="text-red-500">*</span>
            </div>
            <Input
              name="last_name"
              required
              size="large"
              onChange={(e) =>
                setInputs({ ...inputs, [e.target.name]: e.target.value })
              }
              value={inputs?.last_name}
            />
          </div>
          <div className="Email">
            <div className="label">
              Email <span className="text-red-500">*</span>
            </div>
            <Input
              type="email"
              name="email"
              required
              size="large"
              onChange={(e) =>
                setInputs({ ...inputs, [e.target.name]: e.target.value })
              }
              value={inputs?.email}
            />
          </div>
          <div className="Password">
            <div className="label">
              Password <span className="text-red-500">*</span>
            </div>
            <Input
              type="password"
              name="password"
              required
              size="large"
              onChange={(e) =>
                setInputs({ ...inputs, [e.target.name]: e.target.value })
              }
              value={inputs?.password}
            />
          </div>
          <div className="Confirm Password">
            <div className="label">
              Confirm Password <span className="text-red-500">*</span>
            </div>
            <Input
              type="password"
              name="confirm_password"
              required
              size="large"
              onChange={(e) =>
                setInputs({ ...inputs, [e.target.name]: e.target.value })
              }
              value={inputs?.confirm_password}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="my-4 text-black p-4 font-semibold bg-orange-400 hover:text-white rounded-lg"
            type="submit"
          >
            Create User
          </button>
        </div>
      </Form>
    </PageWrapper>
  );
}

export default CreateUsers;
