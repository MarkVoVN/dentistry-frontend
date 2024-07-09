import { request } from "../utils/axios.config";
import { ClinicModel } from "./clinicAPI";

export type ServiceCreateModel = {
  clinicID: string;
  clinicDto?: ClinicModel;
  name: string;
  description: string;
  duration: number;
  price: number;
};

export type ServiceModel = ServiceCreateModel & {
  id?: string;
  serviceID: string;
};

export type ServiceQuery = {
  OrderBy?: string;
  SearchTerm?: string;
  ClinicID?: string;
  PageNumber?: number;
  PageSize?: number;
};

const BASE_URL = "/service";

export const getServiceList = () => {
  return request({
    method: "GET",
    url: `${BASE_URL}`,
    // params: query,
  });
};

export const getServiceById = (id: string) => {
  return request({
    method: "GET",
    url: `${BASE_URL}/${id}`,
  });
};

export const createService = (data: ServiceCreateModel) => {
  return request({
    method: "POST",
    url: `${BASE_URL}`,
    data,
  });
};

export const updateService = (data: ServiceModel) => {
  console.log(data);
  return request({
    method: "PUT",
    url: `${BASE_URL}/${data.serviceID}`,
    // params: {
    //   id: data.serviceID,
    // },
    data,
  });
};

export const deleteService = (id: string) => {
  return request({
    method: "DELETE",
    url: `${BASE_URL}/${id}`,
  });
};
