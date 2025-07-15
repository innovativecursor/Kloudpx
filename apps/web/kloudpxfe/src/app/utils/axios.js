// import axios from "axios";
// import Swal from "sweetalert2";

// let setGlobalLoading = null;
// export const setAxiosGlobalLoading = (fn) => {
//   setGlobalLoading = fn;
// };

// const instance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:10003/",
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "*/*",
//   },
// });

// instance.interceptors.request.use(
//   (config) => {
//     setGlobalLoading?.(true);
//     const token = localStorage.getItem("access_token");
//     if (token) config.headers.Authorization = token;
//     return config;
//   },
//   (error) => {
//     setGlobalLoading?.(false);
//     return Promise.reject(error);
//   }
// );

// instance.interceptors.response.use(
//   (response) => {
//     setGlobalLoading?.(false);
//     return response;
//   },
//   (error) => {
//     setGlobalLoading?.(false);
//     Swal.fire({
//       title: "Error",
//       text: error?.response?.data?.message || "Something went wrong!",
//       icon: "error",
//     });
//     return Promise.reject(error);
//   }
// );

// export default instance;


