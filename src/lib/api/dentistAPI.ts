import { request } from "../utils/axios.config";

export type DentistModel = {
  clinicID: number;
  dentistId: number;
  email: string;
  id?: string;
  image: string;
  name: string;
  phoneNumber: string;
  specialization: string;
  status?: boolean;
};

export type DentistQuery = {
  OrderBy?: string;
  SearchTerm?: string;
  ClinicID?: string;
  PageNumber?: number;
  PageSize?: number;
};

const BASE_URL = "/dentist";

export const getDentistList = () => {
  return request({
    method: "GET",
    url: `${BASE_URL}`,
  });
};

export const getDentistById = (id: string) => {
  return request({
    method: "GET",
    url: `${BASE_URL}/${id}`,
  });
};

export const createDentist = (data: DentistModel) => {
  return request({
    method: "POST",
    url: `${BASE_URL}`,
    data,
  });
};

export const updateDentist = (data: DentistModel) => {
  console.log(data);
  return request({
    method: "PUT",
    url: `${BASE_URL}/${data.dentistId}`,
    data,
  });
};

export const deleteDentist = (id: string) => {
  return request({
    method: "DELETE",
    url: `${BASE_URL}/${id}`,
  });
};

export const queryDentist = (query: DentistQuery) => {
  return request({
    method: "GET",
    url: `${BASE_URL}`,
    params: {
      ...query,
    },
  });
};
