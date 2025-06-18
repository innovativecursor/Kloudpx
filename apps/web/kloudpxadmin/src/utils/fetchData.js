import axios from "axios";

const fetchDataGet = async (url = "", params = {}, headers = {}) => {
  try {
    const response = await axios.get(url, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        ...headers,
      },
    });
    return response.data;
  } catch (e) {
    const message = e.response?.data?.message || e.message;
    console.error("GET error:", message);
    throw new Error(message);
  }
};

const fetchDataPost = async (url = "", data = {}) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Network response not OK");
    return await response.json();
  } catch (e) {
    console.error("fetchDataPost error:", e);
  }
};

export { fetchDataGet, fetchDataPost };
