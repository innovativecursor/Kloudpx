"use client";

import axios from "axios";
import Swal from "sweetalert2";
import { store } from "@/app/redux/store";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

const instance = axios.create({
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // localStorage.removeItem("access_token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

const showError = (error) => {
  Swal.fire({
    title: "Error",
    text:
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong",
    icon: "error",
    confirmButtonText: "Alright!",
    allowOutsideClick: false,
  });
};

const getAuthHeaders = (sendToken) => {
  if (!sendToken) return {};
  const token = getToken();
  return token ? { Authorization: token } : {};
};



export const getAxiosCall = async (
  endpoint,
  params = {},
  sendToken = true,
  useGlobalLoader = true
) => {
  if (useGlobalLoader) {
    store.dispatch({ type: "LOADING", payload: true });
  }

  try {
    const headers = getAuthHeaders(sendToken);
    const response = await instance.get(endpoint, {
      headers,
      params,
    });
    return response;
  } catch (error) {
    throw error;

  } finally {
    if (useGlobalLoader) {
      store.dispatch({ type: "LOADING", payload: false });
    }
  }
};

// POST
export const postAxiosCall = async (endpoint, data, sendToken = true) => {
  store.dispatch({ type: "LOADING", payload: true });
  try {
    const headers = {
      ...getAuthHeaders(sendToken),
      "Content-Type": "application/json",
    };
    const response = await instance.post(endpoint, data, { headers });
    return response.data;
  } catch (error) {
    throw error;

  } finally {
    store.dispatch({ type: "LOADING", payload: false });
  }
};

// PUT
export const updateAxiosCall = async (endpoint, id, data, sendToken = true) => {
  store.dispatch({ type: "LOADING", payload: true });
  try {
    const headers = {
      ...getAuthHeaders(sendToken),
      "Content-Type": "application/json",
    };
    const response = await instance.put(`${endpoint}/${id}`, data, { headers });
    return response.data;
  } catch (error) {
    throw error;
  } finally {
    store.dispatch({ type: "LOADING", payload: false });
  }
};

// DELETE
export const deleteAxiosCall = async (endpoint, sendToken = true) => {
  store.dispatch({ type: "LOADING", payload: true });
  try {
    const headers = getAuthHeaders(sendToken);
    const response = await instance.delete(endpoint, { headers });
    return response.data;
  } catch (error) {
    throw error;
  } finally {
    store.dispatch({ type: "LOADING", payload: false });
  }
};



