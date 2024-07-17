import { request } from "../utils/axios.config";

export type CustomerCreateModel = {
  name: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  gender: string;
  image?: string;
  status: boolean;
};

export type CustomerModel = CustomerCreateModel & {
  id?: string;
  customerID: string;
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

export const updateCustomer = (data: CustomerModel) => {
  return request({
    method: "PUT",
    url: `/customer/${data.customerID}`,
    data,
  });
};

export const createCustomer = (data: CustomerModel) => {
  return request({
    method: "POST",
    url: `/customer`,
    data,
  });
};

export const deleteCustomer = (id: string) => {
  return request({
    method: "DELETE",
    url: `/customer/${id}`,
  });
};
