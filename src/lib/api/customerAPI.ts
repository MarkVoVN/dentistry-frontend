import { request } from "../utils/axios.config";

export const fetchCustomerList = () => {
  return request({
    method: "GET",
    url: `/customer`,
  });
};
