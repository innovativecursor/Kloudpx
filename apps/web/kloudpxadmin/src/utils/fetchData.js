import axios from "axios";

const fetchDataGet = async (url = "") => {
  try {
    let config = {
      url,
      method: "get",
    };

    let response = await axios(config);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const fetchDataPost = async (url = "", data = {}) => {
  try {
    let config = {
      url,
      method: "post",
      data,
      headers: { "content-type": "application/json" },
    };
    let response = await axios(config);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export { fetchDataGet, fetchDataPost };