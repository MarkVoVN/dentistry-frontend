import axios from "axios";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

export const request = async (options) => {
  const accessToken = localStorage.getItem("accessToken");

  accessToken !== "" &&
    (client.defaults.headers.common.Authorization = `Bearer ${accessToken}`);

  const onSuccess = (response) => {
    let pagination = {};
    try {
      if (response.headers["pagination"]) {
        pagination = JSON.parse(response.headers["pagination"]);
      }
    } catch (error) {
      console.log(error);
    }
    return { data: response?.data, pagination };
  };

  const onError = (error) => {
    return Promise.reject(error.response?.data);
  };

  return client(options).then(onSuccess).catch(onError);
};
