/* eslint-disable no-undef */
// @vite-ignore
import axios from "axios";
// @vite-ignore
import { store } from "@store";
// @vite-ignore
import Swal from "sweetalert2";

export const postAxiosCall = async (fullUrl, data) => {
  try {
    store.dispatch({ type: "LOADING", payload: true });

    const _headers = {
      Accept: "*/*",
      Authorization: `${localStorage.getItem("access_token")}`,
    };

    const isFormData = data instanceof FormData;

    const instance = axios.create({
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ..._headers,
      },
    });

    const response = await instance.post(fullUrl, data);

    store.dispatch({ type: "LOADING", payload: false });
    return response.data;
  } catch (error) {
    store.dispatch({ type: "LOADING", payload: false });
    Swal.fire({
      title: "Error",
      text: error?.response?.data?.message || "Something went wrong",
      icon: "error",
      confirmButtonText: "Alright!",
      allowOutsideClick: false,
    });
    return;
  }
};

export const getAxiosCall = async (fullUrl, params = {}) => {
  try {
    store.dispatch({ type: "LOADING", payload: true });

    const _headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "*/*",
      Authorization: `${localStorage.getItem("access_token")}`,
    };

    const response = await axios.get(fullUrl, {
      headers: _headers,
      params,
    });

    store.dispatch({ type: "LOADING", payload: false });
    return response;
  } catch (error) {
    store.dispatch({ type: "LOADING", payload: false });
    Swal.fire({
      title: "Error",
      text: error?.response?.data?.message || "Something went wrong",
      icon: "error",
      confirmButtonText: "Alright!",
      allowOutsideClick: false,
    });
    return;
  }
};

export const updateAxiosCall = async (fullUrl, data) => {
  try {
    store.dispatch({ type: "LOADING", payload: true });

    const _headers = {
      Accept: "*/*",
      Authorization: `${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    };

    const instance = axios.create({ headers: _headers });

    const response = await instance.put(fullUrl, data);

    store.dispatch({ type: "LOADING", payload: false });
    return response.data;
  } catch (error) {
    store.dispatch({ type: "LOADING", payload: false });
    Swal.fire({
      title: "Error",
      text: error?.response?.data?.message || "Something went wrong",
      icon: "error",
      confirmButtonText: "Alright!",
      allowOutsideClick: false,
    });
    return;
  }
};

export const deleteAxiosCall = async (fullUrl) => {
  try {
    store.dispatch({ type: "LOADING", payload: true });

    const _headers = {
      Accept: "*/*",
      Authorization: `${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    };

    const instance = axios.create({ headers: _headers });

    const response = await instance.delete(fullUrl);

    store.dispatch({ type: "LOADING", payload: false });
    return response.data;
  } catch (error) {
    store.dispatch({ type: "LOADING", payload: false });
    Swal.fire({
      title: "Error",
      text: error?.response?.data?.message || "Something went wrong",
      icon: "error",
      confirmButtonText: "Alright!",
      allowOutsideClick: false,
    });
    return;
  }
};
