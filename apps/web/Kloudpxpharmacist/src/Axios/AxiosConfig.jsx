import axios from "axios";
import Swal from "sweetalert2";
import { store } from "../store/index";

const BASE_URL = "http://localhost:10002";

const getToken = () => {
  if (typeof window === "undefined") return null;
  return (
    sessionStorage.getItem("access_token") ||
    localStorage.getItem("access_token")
  );
};

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

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
  return token ? { Authorization: ` ${token}` } : {};
};

export const getAxiosCall = async (endpoint, params = {}, sendToken = true) => {
  store.dispatch({ type: "LOADING", payload: true });
  try {
    const headers = getAuthHeaders(sendToken);
    const response = await instance.get(endpoint, {
      headers,
      params,
    });
    return response.data;
  } catch (error) {
    showError(error);
    throw error;
  } finally {
    store.dispatch({ type: "LOADING", payload: false });
  }
};

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
    showError(error);
    throw error;
  } finally {
    store.dispatch({ type: "LOADING", payload: false });
  }
};

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
    showError(error);
    throw error;
  } finally {
    store.dispatch({ type: "LOADING", payload: false });
  }
};

export const deleteAxiosCall = async (endpoint, sendToken = true) => {
  store.dispatch({ type: "LOADING", payload: true });
  try {
    const headers = getAuthHeaders(sendToken);
    const response = await instance.delete(endpoint, { headers });
    return response.data;
  } catch (error) {
    showError(error);
    throw error;
  } finally {
    store.dispatch({ type: "LOADING", payload: false });
  }
};
