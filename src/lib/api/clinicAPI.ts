import { request } from "../utils/axios.config";

export type ClinicCreateModel = {
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  openingHours: string;
  closingHours: string;
  image: string;
  status: boolean;
};
export type ClinicModel = ClinicCreateModel & {
  id?: string;
  clinicID: string;
};

export type ClinicQuery = {
  OrderBy?: string;
  SearchTerm?: string;
  Status?: boolean;
  PageNumber?: number;
  PageSize?: number;
  [key: string]: any;
};

export const fetchClinicList = () => {
  return request({
    method: "GET",
    url: `/clinic`,
  });
};

export const getClinicById = (id: string) => {
  return request({
    method: "GET",
    url: `/clinic/${id}`,
  });
};

export const createClinic = (data: ClinicCreateModel) => {
  return request({
    method: "POST",
    url: `/clinic`,
    data,
  });
};

export const updateClinic = (data: ClinicModel) => {
  console.log(data);
  return request({
    method: "PUT",
    url: `/clinic`,
    params: {
      id: data.clinicID,
    },
    data,
  });
};

export const deleteClinic = (id: string) => {
  return request({
    method: "DELETE",
    url: `/clinic/${id}`,
  });
};

export const queryClinic = (query: ClinicQuery) => {
  return request({
    method: "GET",
    url: `/clinic`,
    params: {
      ...query,
    },
  });
};
