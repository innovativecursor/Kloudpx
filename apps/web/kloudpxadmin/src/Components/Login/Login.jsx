import { Button, Input } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import CryptoJS from "crypto-js";
import background from "../../assets/Images/background.jpg";
import logo from "../../../public/Homex.webp";
import { postAxiosCall } from "../../Axios/UniversalAxiosCalls";

import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

function Login(props) {
  const navigateTo = useNavigate();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [forgotPassword, setForgotPassword] = useState(false);

  const onLogin = async () => {
    try {
      const encryptedEmail = CryptoJS.AES.encrypt(
        email,
        process.env.REACT_APP_ENCRYPTION
      ).toString();
      const encryptedPassword = CryptoJS.AES.encrypt(
        password,
        process.env.REACT_APP_ENCRYPTION
      ).toString();
      const answer = await postAxiosCall("/login", {
        encryptedEmail,
        encryptedPassword,
      });
      if (answer) {
        localStorage.setItem("access_token", answer?.token);
        props.isLoggedIn(answer?.sendUserInfo);
        navigateTo("/home");
      } else {
        // Handle error
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
        confirmButtonText: "Alright!",
        allowOutsideClick: false,
      });
    }
  };

  const onReset = async () => {
    try {
      const resetPass = await postAxiosCall("/forgotPassword", {
        email: email,
      });
      if (resetPass) {
        Swal.fire({
          title: "Success",
          text: resetPass?.message,
          icon: "success",
          confirmButtonText: "Alright!",
          allowOutsideClick: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error?.message,
        icon: "error",
        confirmButtonText: "Alright!",
        allowOutsideClick: false,
      });
    }
  };

  const forgotPasswordScreen = async () => {
    setForgotPassword(true);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "20px",
          backgroundColor: "#304a36",
          borderRadius: "10px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          webkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(17, 4, 4, 0.3)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div className="flex justify-center">
            <img src={logo} alt="Logo" width={400} />
          </div>
        </div>
        <div
          className="text-3xl mb-4 font-semibold "
          style={{ textAlign: "center", color: "#fff" }}
        >
          {!forgotPassword ? "Login" : "Forgot Password"}
        </div>
        <div className="credentials card shadow-lg bg-homexbg">
          <div className="uName my-4">
            <div
              className="text-xl w-full my-2 font-medium"
              style={{ textAlign: "left", color: "#fff" }}
            >
              Email
            </div>
            <Input
              placeholder="Email"
              type="text"
              size="large"
              onChange={(e) => {
                setEmail(e.target.value?.trimEnd());
              }}
              style={{ borderRadius: "4px" }}
              value={email}
            />
          </div>

          {forgotPassword ? (
            <>
              <div className="flex justify-around items-center flex-row">
                <Button
                  type="primary"
                  size="large"
                  className="flex text-white bg-black justify-around items-center flex-row"
                  onClick={onReset}
                  style={{
                    width: "45%",
                  }}
                >
                  Send Reset Link
                </Button>
                <Button
                  type="primary"
                  size="large"
                  className="text-black bg-white"
                  style={{
                    width: "45%",
                    borderRadius: "4px",
                    borderColor: "#fff",
                  }}
                  onClick={() => setForgotPassword(false)}
                >
                  Go Back to Login
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="password my-4">
                <div
                  className="text-xl my-2 font-medium"
                  style={{ textAlign: "left", color: "#fff" }}
                >
                  Password
                </div>
                <Input.Password
                  placeholder="Password"
                  type="password"
                  size="large"
                  onChange={(e) => {
                    setPassword(e.target.value?.trimEnd());
                  }}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  style={{ borderRadius: "4px" }}
                  value={password}
                />
              </div>
              <div className="flex justify-around items-center flex-row mt-6 gap-5">
                <Button
                  type="primary"
                  className="flex text-white bg-black justify-around items-center flex-row w-full"
                  size="large"
                  onClick={onLogin}
                >
                  <span>Login</span>
                </Button>
                <Button
                  type="primary"
                  size="large"
                  className="text-black bg-white w-full"
                  onClick={forgotPasswordScreen}
                  style={{
                    borderRadius: "4px",
                    borderColor: "#fff",
                  }}
                >
                  <span>Forgot / Change Password</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    isLoggedIn: (sendUserInfo) =>
      dispatch({ type: "LOGGEDIN", payload: sendUserInfo }),
  };
};

export default connect(null, mapDispatchToProps)(Login);
