"use client";

import React, { createContext, useContext, useState } from "react";
import Swal from "sweetalert2";
import { postAxiosCall } from "@/app/lib/axios";
import endpoints from "@/app/config/endpoints";
import { useAuth } from "./AuthContext";

const LoginAuthContext = createContext();

export const LoginAuthProvider = ({ children }) => {
  const [step, setStep] = useState("signup");
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const { setToken } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    otp: "",
  });

  const countryCodes = [
    { label: "(+91)", value: "+91" },
    { label: "(+63)", value: "+63" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openSignup = () => setShowSignup(true);
  const closeSignup = () => setShowSignup(false);
  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => {
    setIsLoginOpen(false);
    setLoginOtpSent(false);
    setFormData((prev) => ({ ...prev, otp: "" }));
  };

  const handleSendOtp = async () => {
    if (!formData.firstName.trim()) {
      return Swal.fire("Error", "Enter first name", "error");
    }

    if (!formData.lastName.trim()) {
      return Swal.fire("Error", "Enter last name", "error");
    }
    if (!formData.email.trim()) {
      return Swal.fire("Error", "Enter email", "error");
    }

    if (!formData.phone.trim()) {
      return Swal.fire("Error", "Enter phone number", "error");
    }
    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      return Swal.fire(
        "Error",
        "Phone number must be exactly 10 digits",
        "error"
      );
    }

    setLoading(true);
    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: `${formData.countryCode}${formData.phone.trim()}`,
      };

      await postAxiosCall(endpoints.basicauthphone.signup, payload, false);
      setStep("verify");
      Swal.fire("Success", "OTP sent successfully!", "success");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send OTP";

      if (message === "Failed to send OTP") {
        Swal.fire("Info", "You are already signed up, please login!", "info");
        closeSignup();
        openLogin();
      } else if (
        message.includes("email already exists") ||
        message.includes("phone already exists")
      ) {
        Swal.fire(
          "Info",
          "Email or phone already registered, please login!",
          "info"
        );
        closeSignup();
        openLogin();
      } else {
        Swal.fire("Error", message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp.trim()) {
      return Swal.fire("Error", "Enter OTP", "error");
    }
    if (!/^[0-9]{6}$/.test(formData.otp.trim())) {
      return Swal.fire("Error", "OTP must be exactly 6 digits", "error");
    }
    setLoading(true);
    try {
      const payload = {
        phone: `${formData.countryCode}${formData.phone}`,
        otp: formData.otp,
      };
      await postAxiosCall(
        endpoints.basicauthphone.signupverify,
        payload,
        false
      );
      Swal.fire("Success", "Signup successful!", "success");
      setFormData({
        firstName: "",
        lastName: "",
        countryCode: "+91",
        phone: "",
        otp: "",
      });
      setStep("signup");
      closeSignup();
      openLogin();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Invalid OTP",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /*** LOGIN Logic ***/
  const handleLoginSendOtp = async (e) => {
    e?.preventDefault();

    if (!formData.phone.trim()) {
      return Swal.fire("Error", "Enter phone number", "error");
    }
    if (!/^[0-9]{7,15}$/.test(formData.phone.trim())) {
      return Swal.fire("Error", "Phone number must be 7-15 digits", "error");
    }

    setLoading(true);
    try {
      const payload = { phone: `${formData.countryCode}${formData.phone}` };
      await postAxiosCall(endpoints.basicauthphone.login, payload, false);

      Swal.fire("Success", "Login OTP sent!", "success");
      setLoginOtpSent(true);
    } catch (err) {
      const message = err.response?.data?.error || "Failed to send OTP";

      if (message === "User not found or not verified") {
        Swal.fire(
          "Info",
          "You are not registered yet. Please signup first!",
          "info"
        );
        closeLogin();
        openSignup();
      } else {
        Swal.fire("Error", message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginVerifyOtp = async (e) => {
    e.preventDefault();

    if (!formData.otp.trim()) {
      return Swal.fire("Error", "Enter OTP", "error");
    }
    if (!/^[0-9]{6}$/.test(formData.otp.trim())) {
      return Swal.fire("Error", "OTP must be exactly 6 digits", "error");
    }

    setLoading(true);
    try {
      const payload = {
        phone: `${formData.countryCode}${formData.phone}`,
        otp: formData.otp,
      };
      const response = await postAxiosCall(
        endpoints.basicauthphone.loginverify,
        payload,
        false
      );

      const tokenFromServer = response?.token;
      if (tokenFromServer) {
        localStorage.setItem("access_token", tokenFromServer);
        setToken(tokenFromServer);
      }

      Swal.fire("Success", "Login successful!", "success");

      setFormData({
        firstName: "",
        lastName: "",
        countryCode: "+91",
        phone: "",
        otp: "",
      });
      setLoginOtpSent(false);
      closeLogin();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Invalid OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginAuthContext.Provider
      value={{
        step,
        setStep,
        loading,
        formData,
        setFormData,
        countryCodes,
        handleChange,
        handleSendOtp,
        handleVerifyOtp,
        showSignup,
        openSignup,
        closeSignup,
        isLoginOpen,
        openLogin,
        closeLogin,
        loginOtpSent,
        handleLoginSendOtp,
        handleLoginVerifyOtp,
      }}
    >
      {children}
    </LoginAuthContext.Provider>
  );
};

export const useLoginAuth = () => useContext(LoginAuthContext);
