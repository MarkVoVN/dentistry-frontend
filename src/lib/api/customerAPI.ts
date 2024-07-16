import { request } from "../utils/axios.config";

export type CustomerModel = {
  id: string;
  name: string;
  email: string;
  dateOfBirth: Date;
  phoneNumber: string;
  address: string;
  gender: string;
  customerID: string;
  image?: string;
  status: string;
};

export type CustomerQuery = {
  OrderBy?: string;
  SearchTerm?: string;
  Status?: boolean;
  PageNumber?: number;
  ClinicID?: string;
  PageSize?: number;
};

export const fetchCustomerList = () => {
  return request({
    method: "GET",
    url: `/customer`,
  });
};
export const getCustomerById = (id: string) => {
  return request({
    method: "GET",
    url: `/customer/${id}`,
  });
};
export const queryCustomer = (query: CustomerQuery) => {
  return request({
    method: "GET",
    url: `/customer`,
    params: {
      ...query,
    },
  });
};
